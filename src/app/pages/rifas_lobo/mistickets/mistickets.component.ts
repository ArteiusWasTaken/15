import {Component, OnDestroy, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {backend_url, swalErrorHttpResponse} from "../../../../environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-mistickets",
  templateUrl: "./mistickets.component.html",
})
export class MisticketsComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isMobile: boolean;
  tickets: any[] = [];

  data = {
    email: '',
    pass: ''
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
  getTickets() {
    console.log(this.data);
    const form_data = new FormData();

    form_data.append("email", this.data.email);
    form_data.append("pass", this.data.pass);

    this.http.post(`${backend_url}misTickets`, form_data).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          swalErrorHttpResponse(error);
        }
    );

  }
}
