import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { RifapageComponent } from "./pages/rifas_lobo/rifa/rifa.component";
import { VerificadorComponent } from "./pages/rifas_lobo/verificador/verificador.component";
import { MisticketsComponent } from "./pages/rifas_lobo/mistickets/mistickets.component";
import { PagosComponent } from "./pages/rifas_lobo/pagos/pagos.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: IndexComponent },
  { path: "rifa", component: RifapageComponent },
  {
    path: "7cf4228d-4d71-4e81-bdb0-09903de96f5e",
    component: VerificadorComponent,
  },
  { path: "mis-tickets", component: MisticketsComponent },
  { path: "pagos", component: PagosComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
