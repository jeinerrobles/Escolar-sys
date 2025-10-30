import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuariosComponent } from './usuarios.component';

const routes: Routes = [
  { path: '', component: UsuariosComponent },
  { path: 'crear', component: UsuarioFormComponent },
  { path: 'editar/:id', component: UsuarioFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
