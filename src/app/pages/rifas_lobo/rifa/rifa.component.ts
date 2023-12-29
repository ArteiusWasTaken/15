import { Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { HttpClient } from "@angular/common/http";

import Swal from "sweetalert2";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import {
  backend_url,
  swalErrorHttpResponse,
} from "src/environments/environment";
import {
  FinalData,
  LoterryTicket,
  Ticket,
  BankDataCollection,
  Participante,
} from "src/app/interfaces";

@Component({
  selector: "app-rifa",
  templateUrl: "rifa.component.html",
  animations: [
    trigger("buttonState", [
      state(
        "inactive",
        style({
          transform: "scale(1)",
          backgroundColor: "#f8f9fa",
          color: "#fff",
        })
      ),
      state(
        "active",
        style({
          transform: "scale(1.05)",
          backgroundColor: "#dc3545",
          color: "#000",
        })
      ),
      transition("inactive => active", animate("100ms ease-in")),
      transition("active => inactive", animate("100ms ease-out")),
    ]),
  ],
})
export class RifapageComponent implements OnInit, OnDestroy {
  final_data: FinalData = {
    name: "",
    last_name: "",
    mail: "",
    phone: "",
    direccion: "",
    pago: "",
  };

  bank_data: BankDataCollection = {
    bancomer: {
      account: "22222222222222",
      spei: "3333333333333333333",
      owner: "Nombre del Titular",
      name: "BBVA BANCOMER",
    },
    santander: {
      card: "4444444444444444",
      owner: "Nombre del Titular",
      name: "SANTANDER",
    },
    banorte: {
      card: "4242424242424242",
      owner: "Nombre del Titular",
      name: "BANORTE",
    },
  };
  searchTerm: string = "";
  itemsPerPage: number = 5000;
  currentPage: number = 1;
  isCollapsed: boolean = true;
  isCheckboxSelected: boolean = false;
  showSearchField: boolean = false;

  modalRef: BsModalRef;
  selectedTicketsModalData: any[] = [];

  tickets: Ticket[] = [];
  lotteryTickets: LoterryTicket[] = [];
  selectedTickets: LoterryTicket[] = [];
  blockedTickets: string[] = [];
  filteredTickets: LoterryTicket[] = [];

  ticket_price: number = 7; // pesos
  ticket_counter: number = 0;
  selected: number = 0;
  selectedImage: number = 1;

  constructor(private modalService: BsModalService, private http: HttpClient) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.selectImage(1);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("rifa-page");

    this.http.get<any>(`${backend_url}getBlockedTickets`).subscribe(
      (response) => {
        this.tickets.push(...response["tickets"]);

        this.tickets.forEach((ticket) => {
          this.blockedTickets.push(ticket.number);
        });

        for (let i = 1; i < 100000; i++) {
          const ticketNumber = i.toString().padStart(5, "0");
          const isBlocked = this.blockedTickets.includes(ticketNumber);

          this.lotteryTickets.push({
            number: ticketNumber,
            selected: false,
            blocked: isBlocked,
          });
        }

        this.filteredTickets = [...this.lotteryTickets];
      },
      (error) => {
        swalErrorHttpResponse(error);
      }
    );
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("rifa-page");
  }

  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }

  add_ticket(n: number) {
    if (this.ticket_counter == 10000 || this.ticket_counter + n > 10000) {
      return;
    }
    this.ticket_counter = this.ticket_counter + n;
  }

  sub_ticket(n: number) {
    if (this.ticket_counter <= 0 || this.ticket_counter - n < 0) {
      return;
    }

    this.ticket_counter = this.ticket_counter - n;

    if (this.ticket_counter < this.selectedTickets.length) {
      const excessSelectedTickets = this.selectedTickets.splice(
        this.ticket_counter,
        this.selectedTickets.length - this.ticket_counter
      );

      excessSelectedTickets.forEach((ticket) => {
        ticket.selected = false;
        const index = this.lotteryTickets.findIndex(
          (t) => t.number === ticket.number
        );
        if (index !== -1) {
          this.lotteryTickets[index] = ticket;
        }
      });
    }
  }

  selectRandomNumbers() {
    if (this.ticket_counter <= 0) {
      Swal.fire({
        title: "",
        icon: "error",
        text: "No tienes una cantidad de tickets válida",
      });
    }

    Swal.fire({
      title: "",
      text: `Seleccionaremos al azar los boletos restantes (${
        this.ticket_counter - this.selectedTickets.length
      })`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const numberOfRandomNumbers = this.ticket_counter;
        const availableTickets = this.lotteryTickets.filter(
          (ticket) => !ticket.selected && !ticket.blocked
        );

        if (availableTickets.length >= numberOfRandomNumbers) {
          for (let i = availableTickets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableTickets[i], availableTickets[j]] = [
              availableTickets[j],
              availableTickets[i],
            ];
          }

          const remainingCount =
            numberOfRandomNumbers - this.selectedTickets.length;
          const remainingAvailableTickets = availableTickets.slice(
            0,
            remainingCount
          );

          remainingAvailableTickets.forEach((ticket) => {
            ticket.selected = true;
            this.selectedTickets.push(ticket);
          });

          const selectedNumbers = this.selectedTickets.map(
            (ticket) => ticket.number
          );
          console.log("Randomly Selected Numbers:", selectedNumbers);
          Swal.fire("Seleccionados al azar!", "", "success");
        } else {
          Swal.fire("No hay suficientes boletos disponibles", "", "error");
        }
      }
    });
  }

  deleteAllSelections() {
    Swal.fire({
      title: "¿Eliminar todas las selecciones?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.lotteryTickets.forEach((ticket) => (ticket.selected = false));
        this.selectedTickets = [];
        if (this.modalRef) {
          this.selectedTicketsModalData = [...this.selectedTickets];
        }
        Swal.fire("Eliminadas todas las selecciones", "", "success");
      }
    });
  }

  deleteSelectedTicket(index: number) {
    const ticketElement = document.getElementById(
      `ticket-${this.selectedTickets[index].number}`
    );
    if (ticketElement) {
      ticketElement.classList.remove("selected");
    }

    this.selectedTickets.splice(index, 1);
    this.selectedTicketsModalData = [...this.selectedTickets];
  }

  openSelectedTicketsModal(template: any) {
    this.selectedTicketsModalData = [...this.selectedTickets].sort((a, b) =>
      a.number.localeCompare(b.number)
    );

    this.modalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  toggleSearchField() {
    this.showSearchField = !this.showSearchField;
    if (!this.showSearchField) {
      this.searchTerm = "";
      this.onSearchChange();
    }
  }

  clearSearch() {
    this.searchTerm = "";
    this.onSearchChange();
    this.showSearchField = false;
  }

  toggleSelection(ticket: any) {
    if (this.ticket_counter > 0) {
      const isAlreadySelected = this.selectedTickets.some(
        (selectedTicket) => selectedTicket.number === ticket.number
      );

      const isBlocked = this.blockedTickets.includes(ticket.number);
      ticket.blocked = isBlocked;
      if (!isBlocked) {
        if (
          !isAlreadySelected &&
          this.selectedTickets.length < this.ticket_counter
        ) {
          ticket.selected = true;
          this.selectedTickets.push(ticket);
        } else if (isAlreadySelected) {
          ticket.selected = false;
          this.selectedTickets = this.selectedTickets.filter(
            (selectedTicket) => selectedTicket.number !== ticket.number
          );
        }
      }
    }
  }

  getCurrentPageTickets() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTickets.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onSearchChange() {
    this.filteredTickets = this.lotteryTickets.filter((ticket) =>
      ticket.number.includes(this.searchTerm)
    );

    this.currentPage = 1;
  }

  async addParticipante() {
    let data = { email: this.final_data.mail };
    const form_data_check = new FormData();
    form_data_check.append("data", JSON.stringify(data));

    let participante: Participante = {
      name: this.final_data.name + " " + this.final_data.last_name,
      email: this.final_data.mail,
      phone: this.final_data.phone,
      address: this.final_data.direccion,
      crear: 0,
    };

    let final_tickets = [];

    this.selectedTickets.forEach((ticket) => {
      final_tickets.push(ticket.number);
    });
    console.log(final_tickets);

    const form_data_add = new FormData();

    this.http
      .post(`${backend_url}checkParticipante`, form_data_check)
      .subscribe(
        (response) => {
          if (response["code"] == 200) {
            form_data_add.append("data", JSON.stringify(participante));
            form_data_add.append("tickets", JSON.stringify(final_tickets));
            this.http
              .post(`${backend_url}addParticipante`, form_data_add)
              .subscribe(
                (response) => {
                  console.log(response);
                },
                (error) => {
                  swalErrorHttpResponse(error);
                }
              );
          } else {
            Swal.fire({
              title: "",
              html: `Ya existe un registro con el correo ${this.final_data.mail}<br/> Selecciona continuar para seguir, cancelar para usar otro`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Continuar",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (!result.isConfirmed) {
                return;
              }
              participante.crear = 1;
              form_data_add.append("data", JSON.stringify(participante));
              form_data_add.append("tickets", JSON.stringify(final_tickets));
              this.http
                .post(`${backend_url}addParticipante`, form_data_add)
                .subscribe(
                  (response) => {
                    console.log(response);
                  },
                  (error) => {
                    swalErrorHttpResponse(error);
                  }
                );
            });
          }
        },
        (error) => {
          swalErrorHttpResponse(error);
        }
      );
  }
}
