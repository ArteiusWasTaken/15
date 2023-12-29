import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  backend_url,
  swalErrorHttpResponse,
} from "src/environments/environment";
import { Ticket } from "src/app/interfaces";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
})
export class IndexComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isMobile: boolean;

  tickets: Ticket[] = [];
  total_tickets: number = 100000;
  sold_tickets: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${backend_url}getBlockedTickets`).subscribe(
      (response) => {
        this.tickets.push(...response["tickets"]);

        this.sold_tickets = this.tickets.length;
      },
      (error) => {
        swalErrorHttpResponse(error);
      }
    );

    this.isMobile = window.innerWidth < 768;

    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 768;
    });

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
}
