import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html",
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;

  ticket_counter: number = 0;
  ticket_price: number = 7; //pesos

  option: "";

  final_data = {
    name: "",
    last_name: "",
    mail: "",
    phone: "",
  };

  bank_data = {
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
  selectedImage: number = 1;

  lotteryTickets: any[] = [];
  selectedTickets: any[] = [];
  itemsPerPage = 1000;
  currentPage = 1;
  searchTerm: string = "";
  filteredTickets: any[] = [];
  showSearchField = false;

  constructor() {
    for (let i = 1; i <= 10000; i++) {
      const ticketNumber = i.toString().padStart(5, "0");
      this.lotteryTickets.push({ number: ticketNumber, selected: false });
    }

    this.filteredTickets = [...this.lotteryTickets];
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
    ticket.selected = !ticket.selected;

    if (ticket.selected) {
      this.selectedTickets.push(ticket);
    } else {
      this.selectedTickets = this.selectedTickets.filter(
        (selectedTicket) => selectedTicket.number !== ticket.number
      );
    }
    console.log(this.selectedTickets);
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

  ngOnInit() {
    this.selectImage(1);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }

  add_ticket(n: number) {
    this.ticket_counter = this.ticket_counter + n;
  }

  sub_ticket(n: number) {
    if (this.ticket_counter <= 0 || this.ticket_counter - n < 0) {
      return;
    }
    this.ticket_counter = this.ticket_counter - n;
  }
  selectRandomNumbers() {
    const numberOfRandomNumbers = 20;
    const availableTickets = this.lotteryTickets.filter(
      (ticket) => !ticket.selected
    );

    if (availableTickets.length >= numberOfRandomNumbers) {
      this.selectedTickets.forEach((ticket) => (ticket.selected = false));
      this.selectedTickets = [];

      // Select random numbers
      for (let i = 0; i < numberOfRandomNumbers; i++) {
        const randomIndex = Math.floor(Math.random() * availableTickets.length);
        const randomTicket = availableTickets[randomIndex];
        randomTicket.selected = true;
        this.selectedTickets.push(randomTicket);
        const selectedNumbers = this.selectedTickets.map(
          (ticket) => ticket.number
        );
        console.log("Randomly Selected Numbers:", selectedNumbers);
      }
    } else {
      console.log("Not enough available tickets to select random numbers.");
    }
  }
}
