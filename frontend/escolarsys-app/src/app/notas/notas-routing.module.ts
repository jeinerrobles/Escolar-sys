import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotasGestionComponent } from './notas-gestion/notas-gestion.component';
import { BoletinComponent } from './boletin/boletin.component';
import { PeriodosAdminComponent } from './periodos-admin/periodos-admin.component';

const routes: Routes = [
  { path: '', component: NotasGestionComponent },
  { path: 'boletin', component: BoletinComponent },
  { path: 'periodos', component:  PeriodosAdminComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasRoutingModule {}
