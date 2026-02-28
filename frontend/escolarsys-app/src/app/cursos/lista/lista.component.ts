import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';
import Swal from "sweetalert2";

declare var bootstrap: any;

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  cursos: any[] = [];
  role: string = '';
  cursoExpandido: number | null = null;

  //  Modal
  cursoSeleccionado: any = null;
  filtro: string = '';

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.obtenerRol();
    this.cargarCursos();
  }

  //  Obtener rol del usuario
  obtenerRol() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.role = user?.role;
  }

  //  Cargar cursos
  cargarCursos() {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;

        // Si es profesor, solo mostrar sus cursos
        if (this.role === 'profesor') {
          const user = JSON.parse(localStorage.getItem('user')!);
          this.cursos = this.cursos.filter(
            curso => curso.profesor?.id === user.id
          );
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los cursos. Por favor cierre sesión y vuelva a ingresar.', 'error');
      }
    });
  }

  //  Eliminar curso (solo admin)
  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este curso se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursosService.deleteCurso(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El curso fue eliminado correctamente', 'success');
            this.cargarCursos();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
          }
        });
      }
    });
  }

  //  Abrir modal de estudiantes
  abrirModal(curso: any) {
    this.cursoSeleccionado = curso;
    this.filtro = '';

    const modalElement = document.getElementById('estudiantesModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  //  Filtrar estudiantes en tiempo real
  estudiantesFiltrados() {
    if (!this.cursoSeleccionado?.estudiantes) return [];

    return this.cursoSeleccionado.estudiantes.filter((est: any) =>
      est.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

}
