import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPaintingPageRoutingModule } from './list-painting-routing.module';

import { ListPaintingPage } from './list-painting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPaintingPageRoutingModule
  ],
  declarations: [ListPaintingPage]
})
export class ListPaintingPageModule {}
