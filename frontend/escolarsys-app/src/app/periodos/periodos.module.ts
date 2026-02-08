import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PeriodoComponent } from './periodo.component';
import { PeriodosRoutingModule } from './periodos-routing.module';

@NgModule({
  declarations: [
    PeriodoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PeriodosRoutingModule
  ]
})
export class PeriodosModule {}
