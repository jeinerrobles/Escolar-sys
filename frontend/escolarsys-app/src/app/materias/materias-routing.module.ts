import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MateriasListComponent } from './materias-list/materias-list.component';
import { MateriaFormComponent } from './materia-form/materia-form.component';

const routes: Routes = [
  { path: '', component: MateriasListComponent },
  { path: 'nuevo', component: MateriaFormComponent },
  { path: 'editar/:id', component: MateriaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MateriasRoutingModule { }
