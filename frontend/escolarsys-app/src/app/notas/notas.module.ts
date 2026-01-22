import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotasRoutingModule } from './notas-routing.module';
import { NotasGestionComponent } from './notas-gestion/notas-gestion.component';
import { BoletinComponent } from './boletin/boletin.component';
import { PeriodosAdminComponent } from './periodos-admin/periodos-admin.component';

@NgModule({
  declarations: [
    NotasGestionComponent,
    BoletinComponent,
    PeriodosAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotasRoutingModule
  ]
})
export class NotasModule {}
