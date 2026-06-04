import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { EditarPerfilPage } from './editar-perfil.page';

const routes: Routes = [
  { path: '', component: EditarPerfilPage }
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [EditarPerfilPage]
})
export class EditarPerfilPageModule {}
