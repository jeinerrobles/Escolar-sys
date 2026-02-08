import { Component, OnInit } from '@angular/core';
import { BoletinesService } from './boletines.service';

@Component({
  selector: 'app-boletin',
  templateUrl: './boletin.component.html',
  styleUrls: ['./boletin.component.scss']
})
export class BoletinComponent implements OnInit {

  // Usuario
  user: any;

  // Filtros (MISMA ESTRUCTURA)
  filtro: any = {
    grado: null,
    curso: null,
    estudiante: null
  };

  // Listas
  grados: any[] = [];
  cursos: any[] = [];
  estudiantes: any[] = [];

  boletin: any = null;
  loading = false;
  mostrarBoletin = false;

  // Variable para controlar vista de estudiante
  esEstudiante = false;

  constructor(private boletinesService: BoletinesService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.esEstudiante = this.user.role === 'estudiante';
    this.cargarGrados();
  }

  // 🔹 Grados
  cargarGrados() {
    if (this.esEstudiante) {
      // Estudiante: carga solo su grado y curso
      this.boletinesService.getGradosParaBoletines().subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.grados = res;

            // Auto-seleccionar el grado del estudiante
            this.filtro.grado = this.grados[0];

            // Si hay cursos, auto-seleccionar el primero (debería ser solo uno)
            if (this.filtro.grado.cursos && this.filtro.grado.cursos.length > 0) {
              this.onGradoChange();

              // Auto-seleccionar el estudiante (él mismo)
              const estudianteActual = this.estudiantes.find(e => e.id === this.user.id);
              if (estudianteActual) {
                this.filtro.estudiante = estudianteActual;
                this.cargarBoletin();
              }
            }
          }
        },
        error: (err) => {
          console.error('Error al cargar grados:', err);
        }
      });
    } else {
      // Profesor o admin: comportamiento normal
      this.boletinesService.getGradosParaBoletines().subscribe({
        next: (res) => {
          this.grados = res;
        },
        error: (err) => {
          console.error('Error al cargar grados para boletines:', err);
        }
      });
    }
  }

  // 🔹 Al seleccionar grado
  onGradoChange() {
    this.cursos = this.filtro.grado?.cursos || [];

    // Para estudiante, solo mostrar su curso
    if (this.esEstudiante && this.cursos.length > 0) {
      this.filtro.curso = this.cursos[0];
      this.onCursoChange();
    } else {
      this.estudiantes = [];
      this.filtro.curso = null;
      this.filtro.estudiante = null;
      this.boletin = [];
    }
  }

  // 🔹 Al seleccionar curso
  onCursoChange() {
    if (this.esEstudiante) {
      // Estudiante: solo puede verse a sí mismo
      this.estudiantes = this.filtro.curso?.estudiantes?.filter(
        (e: any) => e.id === this.user.id
      ) || [];
    } else {
      // Profesor: ve todos los estudiantes del curso
      this.estudiantes = this.filtro.curso?.estudiantes || [];
    }

    this.filtro.estudiante = null;
    this.boletin = [];
  }

  // 🔹 Cargar boletín
  cargarBoletin() {
    if (!this.filtro.estudiante) {
      alert('Debe seleccionar un estudiante');
      return;
    }

    // Validación extra para estudiante
    if (this.esEstudiante && this.filtro.estudiante.id !== this.user.id) {
      alert('Solo puede ver su propio boletín');
      this.filtro.estudiante = null;
      return;
    }

    this.loading = true;
    this.mostrarBoletin = false;

    this.boletinesService
      .getBoletinEstudiante(
        this.filtro.estudiante.id,
        this.filtro.curso.id
      )
      .subscribe({
        next: (res) => {
          this.boletin = res;
          this.loading = false;
          this.mostrarBoletin = true;
        },
        error: (err) => {
          console.error('Error al cargar boletín:', err);
          this.loading = false;
        }
      });
  }

  // 🔹 Si es estudiante, ocultar selección de estudiante
  mostrarSeleccionEstudiante(): boolean {
    return !this.esEstudiante;
  }

  // 🔹 Obtener nombre del estudiante actual
  getNombreEstudiante(): string {
    if (this.esEstudiante) {
      return this.user.nombre || 'Estudiante';
    }
    return this.filtro.estudiante?.nombre || '';
  }
}
