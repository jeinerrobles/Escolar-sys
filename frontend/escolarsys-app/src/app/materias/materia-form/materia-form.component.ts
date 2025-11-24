import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MateriaService } from '../materia.service';
import { GradoService } from '../../grados/grado.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';

@Component({
  selector: 'app-materia-form',
  templateUrl: './materia-form.component.html'
})
export class MateriaFormComponent implements OnInit {
  materiaForm!: FormGroup;
  grados: any[] = []; 
  profesores: any[] = [];
  editMode = false;
  materiaId?: number;

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private gradoService: GradoService,
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materiaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      grados: [[], Validators.required],
      id_profesor: [null]
    });

    // Cargar grados
    this.gradoService.getGrados().subscribe({
      next: (res) => (this.grados = res),
      error: (err) => console.error(err)
    });

    // Cargar profesores
    this.materiaService.getProfesores().subscribe(data => {
      this.profesores = data;
    });

    // Modo edición
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.editMode = true;
        this.materiaId = +id;
        this.cargarMateria(this.materiaId);
      }
    });
  }

  cargarMateria(id: number): void {
    this.materiaService.getMateriaById(id).subscribe({
      next: (materia) => {
        this.materiaForm.patchValue({
          nombre: materia.nombre || '',
          grados: materia.grados?.map((g: any) => g.id) || [],
          id_profesor: materia.profesor?.id || null
        });
      },
      error: () => Swal.fire('Error', 'No se pudo cargar la materia', 'error')
    });
  }

  guardar(): void {
  if (this.materiaForm.invalid) {
    Swal.fire('Atención', 'Debes completar todos los campos requeridos', 'warning');
    return;
  }

  const formValue = this.materiaForm.value;

  // Convertir el campo para enviarlo en el formato del backend
  const data = {
    nombre: formValue.nombre,
    id_profesor: formValue.id_profesor || null,
    id_grados: formValue.grados.map((g: any) => Number(g))  // importantísimo!!!
  };

  if (this.editMode && this.materiaId) {
    this.materiaService.updateMateria(this.materiaId, data).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'La materia fue actualizada correctamente', 'success');
        this.router.navigate(['/materias']);
      },
      error: () =>
        Swal.fire('Error', 'No se pudo actualizar la materia', 'error')
    });
  } else {
    this.materiaService.createMateria(data).subscribe({
      next: () => {
        Swal.fire('Creada', 'La materia fue registrada correctamente', 'success');
        this.router.navigate(['/materias']);
      },
      error: () =>
        Swal.fire('Error', 'No se pudo crear la materia', 'error')
    });
  }
}

onCheckboxChange(event: any) {
  const gradosFormArray = this.materiaForm.get('grados')?.value || [];

  if (event.target.checked) {
    // Agregar el grado seleccionado
    gradosFormArray.push(Number(event.target.value));
  } else {
    // Eliminar grado desmarcado
    const index = gradosFormArray.indexOf(Number(event.target.value));
    if (index > -1) {
      gradosFormArray.splice(index, 1);
    }
  }

  this.materiaForm.patchValue({ grados: gradosFormArray });
}


  cancelar(): void {
    this.router.navigate(['/materias']);
  }
}
