import { Component, OnDestroy, OnInit } from "@angular/core";
import {backend_url, swalErrorHttpResponse} from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {forceAutocomplete} from "@angular/cli/src/utilities/environment-options";
import Swal from "sweetalert2";

@Component({
  selector: "app-verificador",
  templateUrl: "./verificador.component.html",
})
export class VerificadorComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isMobile: boolean;
  participantes: any[] = [];

  data = {
    name: ""
  }

  final_data = {
    id_participante : '',
    tickets : "",
    folio : '',
    amount : '',
    payment_method : "",
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;

    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 768;
    });

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("verificador-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("verificador-page");
  }

  getParticipant() {
    const form_data = new FormData();
    form_data.append('name', this.data.name);

    console.log(this.data.name);

    this.http.post(`${backend_url}getParticipantByName`, form_data).subscribe(
        (response) => {
          console.log(response);
          this.participantes = response['participantes'];
        },
        (error) => {
          swalErrorHttpResponse(error);
        }
    );
  }

  addPayment() {
    console.log(this.final_data);
    const form_data = new FormData();
    form_data.append("data", JSON.stringify(this.final_data));
    this.http.post(`${backend_url}addPago`, form_data).subscribe(
        (response) => {
          console.log(response);
          if(response['code'] == 200) {
            Swal.fire({
              title: "Pago",
              icon: "success",
              text: "Pago creado correctamente",
            });
          } else  {
            Swal.fire({
              title: "Pago",
              icon: "error",
              text: "No se pudo realizar el pago",
            });
          }
        },
        (error) => {
          swalErrorHttpResponse(error);
        }
    );

  }
}
