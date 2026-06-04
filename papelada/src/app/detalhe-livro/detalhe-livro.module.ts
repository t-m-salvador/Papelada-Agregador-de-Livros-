import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { DetalheLivroPage } from './detalhe-livro.page';

const routes: Routes = [
  { path: '', component: DetalheLivroPage }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [DetalheLivroPage]
})
export class DetalheLivroPageModule {}
