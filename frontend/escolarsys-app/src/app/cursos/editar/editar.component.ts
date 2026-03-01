import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../cursos.service';
import Swal from 'sweetalert2';
import { GradoService } from 'src/app/grados/grado.service';

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

  curso: any = {
    id: null,
    nombre: '',
    descripcion: '',
    profesorId: null,
    estudiantesIds: [],
    id_grado: null
  };

  profesores: any[] = [];
  estudiantes: any[] = [];
  grados: any[] = [];

  selectAll: boolean = false;

  // 🔎 FILTRO + PAGINACIÓN
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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar curso
    this.cursosService.getCurso(id).subscribe((data) => {
      this.curso = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        profesorId: data.profesor?.id,
        estudiantesIds: data.estudiantes?.map((e: any) => e.id) || [],
        id_grado: data.grado?.id || null
      };

      // Cargar estudiantes y marcar seleccionados
      this.cursosService.getEstudiantes().subscribe((estudiantes) => {
        this.estudiantes = estudiantes.map((e: any) => ({
          ...e,
          seleccionado: this.curso.estudiantesIds.includes(e.id)
        }));

        this.aplicarFiltroEstudiantes();
      });
    });

    // Profesores
    this.cursosService.getProfesores().subscribe((data) => {
      this.profesores = data;
      this.profesoresFiltrados = data;
    });

    // Grados
    this.gradoService.getGrados()
      .subscribe(data => this.grados = data);
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

  toggleAllEstudiantes() {
    this.estudiantesFiltrados.forEach(
      e => (e.seleccionado = this.selectAll)
    );
  }

  actualizarCurso() {
    // Recolectar IDs seleccionados
    this.curso.estudiantesIds = this.estudiantes
      .filter(e => e.seleccionado)
      .map(e => e.id);

    this.cursosService.updateCurso(this.curso.id, this.curso).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'El curso fue actualizado correctamente', 'success');
        this.router.navigate(['panel/cursos']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el curso', 'error');
      }
    });
  }

}
