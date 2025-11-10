import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GradosRoutingModule } from './grados-routing.module';

import { GradosComponent } from './grados.component';
import { GradoFormComponent } from './grado-form/grado-form.component';

@NgModule({
  declarations: [
    GradosComponent,
    GradoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GradosRoutingModule,
    ReactiveFormsModule
  ]
})
export class GradosModule { }



