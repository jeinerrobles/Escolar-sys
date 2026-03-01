import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';
import Swal from "sweetalert2";
import {Router} from "@angular/router";

declare var bootstrap: any;

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  cursosOriginal: any[] = [];
  cursosFiltrados: any[] = [];
  cursosPaginados: any[] = [];

  terminoBusqueda: string = '';

  paginaActual = 1;
  registrosPorPagina = 5;
  totalPaginas = 1;

  role: string = '';
  cursoExpandido: number | null = null;

  //  Modal
  cursoSeleccionado: any = null;
  filtro: string = '';

  estudiantesFiltradosList: any[] = [];
  estudiantesPaginados: any[] = [];

  paginaEstudiantes = 1;
  registrosEstudiantes = 5;
  totalPaginasEstudiantes = 1;

  constructor(private cursosService: CursosService, private router: Router,) {}

  ngOnInit(): void {
    this.obtenerRol();
    this.cargarCursos();
  }

  //  Obtener rol del usuario
  obtenerRol() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.role = user?.role;
  }

  get esAdmin(): boolean {
    return this.role === 'admin';
  }

  //  Cargar cursos
  cargarCursos() {
    this.cursosService.getCursos().subscribe({
      next: (data) => {

        this.cursosOriginal = data;

        if (this.role === 'profesor') {
          const user = JSON.parse(localStorage.getItem('user')!);
          this.cursosOriginal = this.cursosOriginal.filter(
            curso => curso.profesor?.id === user.id
          );
        }

        this.aplicarFiltroCursos();

      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los cursos. Por favor cierre sesión y vuelva a ingresar.', 'error');
      }
    });
  }

  aplicarFiltroCursos() {

    if (!this.terminoBusqueda) {
      this.cursosFiltrados = [...this.cursosOriginal];
    } else {
      const t = this.terminoBusqueda.toLowerCase();

      this.cursosFiltrados = this.cursosOriginal.filter(c =>
        c.nombre.toLowerCase().includes(t) ||
        c.profesor?.nombre?.toLowerCase().includes(t) ||
        c.id.toString().includes(t)
      );
    }

    this.paginaActual = 1;
    this.calcularPaginacionCursos();
  }

  calcularPaginacionCursos() {
    this.totalPaginas = Math.ceil(
      this.cursosFiltrados.length / this.registrosPorPagina
    );
    this.cambiarPaginaCursos(this.paginaActual);
  }

  cambiarPaginaCursos(p: number) {
    if (p < 1 || p > this.totalPaginas) return;

    this.paginaActual = p;

    const inicio = (p - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.cursosPaginados = this.cursosFiltrados.slice(inicio, fin);
  }

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
    this.paginaEstudiantes = 1;
    this.aplicarFiltroEstudiantes();

    const modalElement = document.getElementById('estudiantesModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  aplicarFiltroEstudiantes() {

    if (!this.cursoSeleccionado?.estudiantes) {
      this.estudiantesFiltradosList = [];
      return;
    }

    const t = this.filtro.toLowerCase();

    this.estudiantesFiltradosList =
      this.cursoSeleccionado.estudiantes.filter((e: any) =>
        e.nombre.toLowerCase().includes(t)
      );

    this.totalPaginasEstudiantes = Math.ceil(
      this.estudiantesFiltradosList.length / this.registrosEstudiantes
    );

    this.cambiarPaginaEstudiantes(this.paginaEstudiantes);
  }

  cambiarPaginaEstudiantes(p: number) {
    if (p < 1 || p > this.totalPaginasEstudiantes) return;

    this.paginaEstudiantes = p;

    const inicio = (p - 1) * this.registrosEstudiantes;
    const fin = inicio + this.registrosEstudiantes;

    this.estudiantesPaginados =
      this.estudiantesFiltradosList.slice(inicio, fin);
  }

  crearCurso(): void {
    this.router.navigate(['panel/cursos/crear']);
  }

}
