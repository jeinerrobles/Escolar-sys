import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotasGestionComponent } from './notas-gestion/notas-gestion.component';

const routes: Routes = [
  {
    path: '',
    component: NotasGestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasRoutingModule {}
