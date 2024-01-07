import { Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";

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
  Participante,
  CorreoParticipante,
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
    mail: "",
    phone: "",
    state: "",
  };

  searchTerm: string = "";
  itemsPerPage: number = 5000;
  currentPage: number = 1;
  isCollapsed: boolean = true;
  isCheckboxSelected: boolean = false;
  showSearchField: boolean = false;
  isLoadingTickets: boolean = false;
  states: any[] = [];

  modalRef: BsModalRef;
  selectedTicketsModalData: any[] = [];

  tickets: Ticket[] = [];
  lotteryTickets: LoterryTicket[] = [];
  selectedTickets: LoterryTicket[] = [];
  blockedTickets: string[] = [];
  purchasedTickets: string[] = [];
  filteredTickets: LoterryTicket[] = [];

  correoParticipanteData: CorreoParticipante = {
    name: "",
    pw: "",
    code: "",
    email: "",
    tickets: [],
  };

  ticket_price: number = 7; // pesos
  ticket_counter: number = 0;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("rifa-page");

    this.http.get<any>(`${backend_url}getBlockedTickets`).subscribe(
      (response) => {
        console.log(response);

        this.tickets.push(...response["tickets"]);
        this.states = response["states"];
        console.log(this.states);

        this.tickets.forEach((ticket) => {
          ticket.status == 2
            ? this.blockedTickets.push(ticket.number)
            : this.purchasedTickets.push(ticket.number);
        });

        for (let i = 1; i < 100000; i++) {
          const ticketNumber = i.toString().padStart(5, "0");
          const isBlocked = this.blockedTickets.includes(ticketNumber);
          const isPurchased = this.purchasedTickets.includes(ticketNumber);

          this.lotteryTickets.push({
            number: ticketNumber,
            selected: false,
            blocked: isBlocked,
            purchased: isPurchased,
          });
        }

        this.filteredTickets = [...this.lotteryTickets];
      },
      (error) => {
        swalErrorHttpResponse(error);
      }
    );
    this.spinner.hide();
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("rifa-page");
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
        text: "No tienes boletos para elegir",
      });
    }

    Swal.fire({
      title: "",
      text: `Elegir a la suerte? (${
        this.ticket_counter - this.selectedTickets.length
      } Boletos)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Dale",
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

          Swal.fire("Buena Suerte!", "", "success");
        } else {
          Swal.fire("No hay suficientes boletos disponibles", "", "error");
        }
      }
    });
  }

  deleteAllSelections() {
    Swal.fire({
      title: "¿Eliminar elegidos?",
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
        Swal.fire("Eliminadas elegidos", "", "success");
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
      name: this.final_data.name,
      email: this.final_data.mail,
      phone: this.final_data.phone,
      state: this.final_data.state,
      crear: 0,
    };

    let final_tickets = [];

    this.selectedTickets.forEach((ticket) => {
      final_tickets.push(ticket.number);
    });

    const form_data_add = new FormData();
    this.spinner.show();
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
                  const mensaje = `<b>ID</b>: ${response["clave"]}<br/><b>Contraseña:</b> ${response["password"]}<br/>se envió la información por correo. <br/>Conserve su <b>ID y Contraseña</b>`;
                  this.correoParticipanteData = {
                    name: response["name"],
                    pw: response["password"],
                    code: response["clave"],
                    email: response["email"],
                    tickets: final_tickets,
                  };
                  this.spinner.hide();
                  Swal.fire({
                    title: "¡Boletos apartados!",
                    html: mensaje,
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Continuar",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: true, // Permite la selección del texto
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.spinner.show();
                      const form_data_correo = new FormData();
                      form_data_correo.append(
                        "data",
                        JSON.stringify(this.correoParticipanteData)
                      );
                      console.log(this.correoParticipanteData);

                      this.http
                        .post<any>(
                          `${backend_url}enviarCorreo`,
                          form_data_correo
                        )
                        .subscribe(
                          (response) => {
                            this.resetVariables();
                          },
                          (error) => {
                            swalErrorHttpResponse(error);
                          }
                        );
                    }
                  });
                  Swal.getPopup().addEventListener("touchstart", function (e) {
                    e.stopPropagation();
                  });
                },
                (error) => {
                  this.resetVariables();
                  this.spinner.hide();
                  swalErrorHttpResponse(error);
                }
              );
          } else {
            this.spinner.hide();
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
              this.spinner.show();

              participante.crear = 1;
              form_data_add.append("data", JSON.stringify(participante));
              form_data_add.append("tickets", JSON.stringify(final_tickets));
              this.http
                .post(`${backend_url}addParticipante`, form_data_add)
                .subscribe(
                  (response) => {
                    const mensaje = `<b>ID</b>: ${response["clave"]}<br/><b>Contraseña:</b> ${response["password"]}<br/>se envió la información por correo. <br/>Conserve su <b>ID y Contraseña</b>`;
                    this.correoParticipanteData = {
                      name: response["name"],
                      pw: response["password"],
                      code: response["clave"],
                      email: response["email"],
                      tickets: final_tickets,
                    };
                    this.spinner.hide();
                    Swal.fire({
                      title: "¡Boletos apartados!",
                      html: mensaje,
                      icon: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#3085d6",
                      confirmButtonText: "Continuar",
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      allowEnterKey: true, // Permite la selección del texto
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.spinner.show();
                        const form_data_correo = new FormData();
                        form_data_correo.append(
                          "data",
                          JSON.stringify(this.correoParticipanteData)
                        );
                        console.log(this.correoParticipanteData);

                        this.http
                          .post<any>(
                            `${backend_url}enviarCorreo`,
                            form_data_correo
                          )
                          .subscribe(
                            (response) => {
                              this.resetVariables();
                            },
                            (error) => {
                              swalErrorHttpResponse(error);
                            }
                          );
                      }
                    });
                    Swal.getPopup().addEventListener(
                      "touchstart",
                      function (e) {
                        e.stopPropagation();
                      }
                    );
                  },
                  (error) => {
                    this.resetVariables();
                    this.spinner.hide();
                    swalErrorHttpResponse(error);
                  }
                );
            });
          }
        },
        (error) => {
          this.spinner.hide();
          swalErrorHttpResponse(error);
        }
      );
  }
  resetVariables() {
    this.final_data = {
      name: "",
      mail: "",
      phone: "",
      state: "",
    };
    this.correoParticipanteData = {
      name: "",
      pw: "",
      code: "",
      email: "",
      tickets: [],
    };
    this.searchTerm = "";
    this.itemsPerPage = 5000;
    this.currentPage = 1;
    this.isCollapsed = true;
    this.isCheckboxSelected = false;
    this.showSearchField = false;
    this.modalRef = null;
    this.selectedTicketsModalData = [];
    this.tickets = [];
    this.lotteryTickets = [];
    this.selectedTickets = [];
    this.blockedTickets = [];
    this.filteredTickets = [];
    this.ticket_price = 7;
    this.ticket_counter = 0;
    this.ngOnInit();
  }
}
