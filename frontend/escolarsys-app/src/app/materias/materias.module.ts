import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MateriasRoutingModule } from './materias-routing.module';
import { MateriasListComponent } from './materias-list/materias-list.component';
import { MateriaFormComponent } from './materia-form/materia-form.component';

@NgModule({
  declarations: [MateriasListComponent, MateriaFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MateriasRoutingModule]
})
export class MateriasModule {}
