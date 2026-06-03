import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinhabibliotecaPageRoutingModule } from './minhabiblioteca-routing.module';

import { MinhabibliotecaPage } from './minhabiblioteca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinhabibliotecaPageRoutingModule
  ],
  declarations: [MinhabibliotecaPage]
})
export class MinhabibliotecaPageModule {}
