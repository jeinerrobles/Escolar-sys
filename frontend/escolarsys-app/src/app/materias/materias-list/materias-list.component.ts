import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../materia.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-materias-list',
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.scss']
})
export class MateriasListComponent implements OnInit {
  materias: any[] = [];
  materiasFiltradas: any[] = [];
  materiasPaginadas: any[] = [];

  cargando = false;
  role: string | null = null;

  // 🔎 FILTRO
  terminoBusqueda = '';

  // 📄 PAGINACIÓN
  paginaActual = 1;
  registrosPorPagina = 5;
  totalPaginas = 1;

  constructor(
    private materiaService: MateriaService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.obtenerMaterias();
  }

  get esAdmin(): boolean {
    return this.role === 'admin';
  }

  obtenerMaterias(): void {
    this.cargando = true;
    this.materiaService.getMaterias().subscribe({
      next: (res) => {
        this.materias = res;
        this.cargando = false;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;

        Swal.fire(
          'Error',
          'No se pudieron cargar las materias. Por favor cierre sesión y vuelva a ingresar.',
          'error'
        );
      }
    });
  }

  aplicarFiltro(): void {

    if (!this.terminoBusqueda) {
      this.materiasFiltradas = [...this.materias];
    } else {
      const t = this.terminoBusqueda.toLowerCase();

      this.materiasFiltradas = this.materias.filter(m => {

        const nombre = m.nombre?.toLowerCase() || '';
        const profesor = m.profesor?.nombre?.toLowerCase() || '';

        const grados = (m.grados || [])
          .map((g: any) => g.nombre.toLowerCase())
          .join(' ');

        return (
          nombre.includes(t) ||
          profesor.includes(t) ||
          grados.includes(t)
        );
      });
    }

    this.paginaActual = 1;

    this.totalPaginas = Math.ceil(
      this.materiasFiltradas.length / this.registrosPorPagina
    );

    // ⭐ SI NO HAY RESULTADOS → LIMPIAR TABLA
    if (this.materiasFiltradas.length === 0) {
      this.materiasPaginadas = [];
      return;
    }

    this.cambiarPagina(1);
  }

  cambiarPagina(p: number): void {

    if (this.materiasFiltradas.length === 0) {
      this.materiasPaginadas = [];
      return;
    }

    if (p < 1 || p > this.totalPaginas) return;

    this.paginaActual = p;

    const inicio = (p - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.materiasPaginadas =
      this.materiasFiltradas.slice(inicio, fin);
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta materia se eliminará permanentemente.',
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
