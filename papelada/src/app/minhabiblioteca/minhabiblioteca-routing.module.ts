import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhabibliotecaPage } from './minhabiblioteca.page';

const routes: Routes = [
  {
    path: '',
    component: MinhabibliotecaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhabibliotecaPageRoutingModule {}
