import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AjudaPage } from './ajuda.page';

const routes: Routes = [
  { path: '', component: AjudaPage }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [AjudaPage]
})
export class AjudaPageModule {}
