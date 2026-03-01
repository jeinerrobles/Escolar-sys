import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursosService } from '../cursos.service';
import Swal from 'sweetalert2';
import { GradoService } from 'src/app/grados/grado.service';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {
  curso: { nombre: string; descripcion: string; profesorId: number | null; estudiantesIds: number[]; id_grado: number | null; } = { nombre: '', descripcion: '', profesorId: null, estudiantesIds: [], id_grado: null };
  profesores: any[] = [];
  estudiantes: any[] = [];
  selectAll: boolean = false;
  grados: any[] = []

  // ================================
// 🔎 FILTRO + PAGINACIÓN ESTUDIANTES
// ================================

  terminoBusqueda = '';

  estudiantesFiltrados: any[] = [];
  estudiantesPaginados: any[] = [];

  paginaActual = 1;
  registrosPorPagina = 8;
  totalPaginas = 1;


// ================================
// 🔎 FILTRO PROFESORES (DIRECTOR)
// ================================

  filtroProfesor = '';
  profesoresFiltrados: any[] = [];

  constructor(
    private cursosService: CursosService,
    private gradoService: GradoService,
    private router: Router) { }

  ngOnInit() {
    this.cursosService.getProfesores().subscribe((data) => {
      this.profesores = data;
      this.profesoresFiltrados = data;
    });

    this.cursosService.getEstudiantes().subscribe((data) => {
      this.estudiantes = data;
      this.aplicarFiltroEstudiantes();
    });

    this.gradoService.getGrados().subscribe((data) => {
      this.grados = data;
    });
  }

  toggleAllEstudiantes() {
    this.estudiantesFiltrados.forEach(
      e => (e.seleccionado = this.selectAll)
    );
  }

  aplicarFiltroEstudiantes() {

    if (!this.terminoBusqueda) {
      this.estudiantesFiltrados = [...this.estudiantes];
    } else {
      const t = this.terminoBusqueda.toLowerCase();

      this.estudiantesFiltrados = this.estudiantes.filter(e =>
        e.nombre.toLowerCase().includes(t) ||
        e.email.toLowerCase().includes(t)
      );
    }

    this.paginaActual = 1;

    this.totalPaginas = Math.ceil(
      this.estudiantesFiltrados.length / this.registrosPorPagina
    );

    this.cambiarPagina(1);
  }

  cambiarPagina(p: number) {

    if (p < 1 || p > this.totalPaginas) return;

    this.paginaActual = p;

    const inicio = (p - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.estudiantesPaginados =
      this.estudiantesFiltrados.slice(inicio, fin);
  }

  filtrarProfesores() {

    if (!this.filtroProfesor) {
      this.profesoresFiltrados = [...this.profesores];
    } else {
      const t = this.filtroProfesor.toLowerCase();

      this.profesoresFiltrados = this.profesores.filter(p =>
        p.nombre.toLowerCase().includes(t)
      );
    }

  }

  crearCurso() {
    // Recolectar IDs seleccionados
    this.curso.estudiantesIds = this.estudiantes
      .filter((e) => e.seleccionado)
      .map((e) => e.id);

    this.cursosService.createCurso(this.curso).subscribe({
      next: () => {
        Swal.fire('Creado', 'El curso fue creado correctamente', 'success');
        this.router.navigate(['panel/cursos']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el curso', 'error');
      }
    });
  }
}
