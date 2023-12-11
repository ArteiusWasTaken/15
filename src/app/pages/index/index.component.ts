import { Component, OnInit, OnDestroy } from "@angular/core";
import noUiSlider from "nouislider";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
})
export class IndexComponent implements OnInit, OnDestroy {
  ticket_counter: number = 0;
  ticket_price: number = 5; //pesos

  option: "";
  isCollapsed = true;
  focus;
  focus1;
  focus2;
  date = new Date();
  pagination = 3;
  pagination1 = 1;

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

  constructor() {}

  log() {
    console.log(this.option);
  }
  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit() {
    this.selectImage(1);
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    body.classList.add("profile-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
    body.classList.remove("profile-page");
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
}
