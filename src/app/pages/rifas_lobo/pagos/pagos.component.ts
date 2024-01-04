import { Component, OnInit, OnDestroy } from "@angular/core";
import { Tarjeta } from "src/app/interfaces";

@Component({
  selector: "app-pagos",
  templateUrl: "./pagos.component.html",
})
export class PagosComponent implements OnInit, OnDestroy {
  isCollapsed: boolean = true;
  tarjetas: Tarjeta[] = [
    {
      nombre: "Temporal",
      numero: "5555555555554444",
      tipo: "",
      banco: "Santander",
    },
    {
      nombre: "Temporal",
      numero: "4222222222222222",
      tipo: "",
      banco: "Bancomer",
    },
  ];

  constructor() {}

  ngOnInit() {
    window.scrollTo(0, 0);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");

    this.tarjetas.forEach((element) => {
      element.tipo = this.verificarTipoTarjeta(element.numero);
      element.numero = this.formatCardNumber(element.numero);
    });
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  verificarTipoTarjeta(cardNumber): string {
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardPattern = /^5[1-5][0-9]{14}$/;

    if (cardNumber.match(visaPattern)) {
      return "visa";
    } else if (cardNumber.match(mastercardPattern)) {
      return "mastercard";
    } else {
      return "Desconocida";
    }
  }
  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) {
      return "Invalid card number";
    }

    return cardNumber.replace(/(.{4})/g, "$1 ");
  }
}
