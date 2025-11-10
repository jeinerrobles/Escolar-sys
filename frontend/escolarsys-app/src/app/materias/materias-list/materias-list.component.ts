import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../materia.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materias-list',
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.scss']
})
export class MateriasListComponent implements OnInit {
  materias: any[] = [];
  cargando = false;

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  obtenerMaterias(): void {
    this.cargando = true;
    this.materiaService.getMaterias().subscribe({
      next: (res) => {
        this.materias = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar materia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materiaService.deleteMateria(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La materia fue eliminada correctamente', 'success');
            this.obtenerMaterias();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar la materia', 'error');
          }
        });
      }
    });
  }

  crearNueva(): void {
    this.router.navigate(['/materias/nuevo']);
  }
}
