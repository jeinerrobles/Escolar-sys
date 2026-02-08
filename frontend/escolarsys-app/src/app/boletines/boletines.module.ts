import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BoletinComponent } from './boletin.component';
import { BoletinesRoutingModule } from './boletines-routing.module';

@NgModule({
  declarations: [
    BoletinComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BoletinesRoutingModule
  ]
})
export class BoletinesModule {}
