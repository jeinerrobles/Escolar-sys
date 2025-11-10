import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GradoService } from '../grado.service';

@Component({
  selector: 'app-grado-form',
  templateUrl: './grado-form.component.html'
})
export class GradoFormComponent implements OnInit {
  gradoForm!: FormGroup;
  editMode = false;
  gradoId?: number;

  constructor(
    private fb: FormBuilder,
    private gradoService: GradoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gradoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

    // Si hay un ID en la URL → modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.gradoId = +params['id'];
        this.cargarGrado(this.gradoId);
      }
    });
  }

  cargarGrado(id: number): void {
    this.gradoService.getGradoById(id).subscribe({
      next: (grado) => {
        this.gradoForm.patchValue({
          nombre: grado.nombre,
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar el grado', 'error');
      }
    });
  }

  guardar(): void {
    if (this.gradoForm.invalid) {
      Swal.fire('Atención', 'Debes completar todos los campos requeridos', 'warning');
      return;
    }

    const data = this.gradoForm.value;

    if (this.editMode && this.gradoId) {
      this.gradoService.updateGrado(this.gradoId, data).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El grado fue actualizado correctamente', 'success');
          this.router.navigate(['/grados']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el grado', 'error');
        }
      });
    } else {
      this.gradoService.createGrado(data).subscribe({
        next: () => {
          Swal.fire('Creado', 'El grado fue registrado correctamente', 'success');
          this.router.navigate(['/grados']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el grado', 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/grados']);
  }
}
