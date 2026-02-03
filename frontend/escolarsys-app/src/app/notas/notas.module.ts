import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotasRoutingModule } from './notas-routing.module';
import { NotasGestionComponent } from './notas-gestion/notas-gestion.component';

@NgModule({
  declarations: [
    NotasGestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotasRoutingModule
  ]
})
export class NotasModule {}
