import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  { path: '', component: ListComponent},
  { path: 'crear', component: CreateComponent},
  { path: 'editar/:id', component: EditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
