import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
})
export class IndexComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isMobile: boolean;

  constructor() {}

  ngOnInit() {
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
