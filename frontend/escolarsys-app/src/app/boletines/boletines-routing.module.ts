import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoletinComponent } from './boletin.component';

const routes: Routes = [
  { path: '', component: BoletinComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletinesRoutingModule {}
