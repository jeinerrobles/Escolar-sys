import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodoComponent } from './periodo.component';

const routes: Routes = [
  { path: '', component: PeriodoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodosRoutingModule {}
