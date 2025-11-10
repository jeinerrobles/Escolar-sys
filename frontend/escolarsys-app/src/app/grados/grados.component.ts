import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GradoService } from './grado.service';

@Component({
  selector: 'app-grados-list',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.scss']
})
export class GradosComponent implements OnInit {
  grados: any[] = [];
  loading = false;

  constructor(private gradoService: GradoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  cargarGrados(): void {
    this.loading = true;
    this.gradoService.getGrados().subscribe({
      next: (res) => {
        this.grados = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
      }
    });
  }

  verCursos(grado: any): void {
    this.router.navigate(['/grados', grado.id, 'cursos']);
  }

  verMaterias(grado: any): void {
    this.router.navigate(['/grados', grado.id, 'materias']);
  }

  nuevoGrado(): void {
    this.router.navigate(['/grados/nuevo']);
  }

  editarGrado(grado: any): void {
    this.router.navigate(['/grados/editar', grado.id]);
  }

  eliminarGrado(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este grado se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradoService.deleteGrado(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El grado fue eliminado correctamente', 'success');
            this.cargarGrados();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
          }
        });
      }
    });
  }
}
