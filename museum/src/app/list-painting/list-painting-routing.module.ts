import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPaintingPage } from './list-painting.page';

const routes: Routes = [
  {
    path: '',
    component: ListPaintingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPaintingPageRoutingModule {}
