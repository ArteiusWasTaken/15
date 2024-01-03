import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-verificador",
  templateUrl: "./verificador.component.html",
})
export class VerificadorComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isMobile: boolean;

  constructor() {}

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
}
