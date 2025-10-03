import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { ListaComponent } from './lista/lista.component';
import { CrearComponent } from './crear/crear.component';
import { EditarComponent } from './editar/editar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListaComponent,
    CrearComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    FormsModule
  ]
})
export class CursosModule { }
