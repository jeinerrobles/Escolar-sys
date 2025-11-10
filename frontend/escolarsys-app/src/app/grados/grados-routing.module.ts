import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradosComponent } from './grados.component';
import { GradoFormComponent } from './grado-form/grado-form.component';

const routes: Routes = [
  { path: '', component: GradosComponent },
  { path: 'nuevo', component: GradoFormComponent },
  { path: 'editar/:id', component: GradoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradosRoutingModule {}
