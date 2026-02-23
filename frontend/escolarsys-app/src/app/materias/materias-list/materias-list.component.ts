import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../materia.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service'; // 👈 IMPORTANTE

@Component({
  selector: 'app-materias-list',
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.scss']
})
export class MateriasListComponent implements OnInit {
  materias: any[] = [];
  cargando = false;
  role: string | null = null; // 👈 guardamos el rol

  constructor(
    private materiaService: MateriaService,
    private router: Router,
    private authService: AuthService // 👈 inyectamos
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole(); // 👈 obtenemos rol
    this.obtenerMaterias();
  }

  // 👇 getter limpio para usar en el HTML
  get esAdmin(): boolean {
    return this.role === 'admin'; 
    // ⚠️ si tu backend devuelve 'ADMIN' cambia por:
    // return this.role === 'ADMIN';
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
    this.router.navigate(['panel/materias/nuevo']);
  }
}
