import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuariosComponent } from './usuarios.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuariosComponent, 
    UsuarioFormComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule
  ]
})
export class UsuariosModule { }
