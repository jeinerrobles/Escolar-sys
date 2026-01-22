import { Component } from '@angular/core';
import { NotasService } from '../notas.service';

@Component({
  selector: 'app-notas-gestion',
  templateUrl: './notas-gestion.component.html',
  styleUrls: ['./notas-gestion.component.scss']
})
export class NotasGestionComponent {

  // Usuario logueado
  user: any;

  // Filtros
  filtro: any = {
    grado: null,
    curso: null,
    materia: null,
    periodo: 1
  };

  // Listas
  grados: any[] = [];
  cursos: any[] = [];
  materias: any[] = [];
  estudiantes: any[] = [];
  periodos: any[] = [];
  periodosHabilitados: any[] = [];

  loading = false;
  mostrarTabla = false;
  periodoActualEditable = false;


  constructor(private notasService: NotasService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cargarGrados();
    this.cargarPeriodos();
  }

  // 🔹 Cargar grados
  cargarGrados() {
    this.notasService.getGrados().subscribe(res => {
      this.grados = res;
    });
  }

  // 🔹 Al seleccionar grado
  onGradoChange() {
    this.cursos = this.filtro.grado?.cursos || [];
    this.materias = this.filtro.grado?.materias || [];
    this.filtro.curso = null;
    this.filtro.materia = null;
  }

  onFiltroChange() {
    this.mostrarTabla = false;
  }


  // 🔹 Cargar estudiantes y notas
  cargarNotas() {
    if (!this.filtro.curso || !this.filtro.materia || !this.filtro.periodo) {
      alert('Debe seleccionar grado, curso, materia y periodo');
      return;
    }

    this.periodoActualEditable = this.periodoEditable();

    this.loading = true;
    this.mostrarTabla = false;

    this.notasService
      .getNotasEstructura(
        this.filtro.curso.id,
        this.filtro.materia.id,
        this.filtro.periodo
      )
      .subscribe(res => {
        this.estudiantes = res.estudiantes.map((e: any) => ({
          ...e,
          nota: e.nota ?? ''
        }));

        this.loading = false;
        this.mostrarTabla = true;
      });
  }

  // 🔹 Guardar notas
  guardarNotas() {
    const payload = {
      curso_id: this.filtro.curso.id,
      materia_id: this.filtro.materia.id,
      periodo: this.filtro.periodo,
      notas: this.estudiantes.map(e => ({
        estudiante_id: e.id,
        nota: Number(e.nota)
      }))
    };

    this.notasService.guardarNotas(payload).subscribe(() => {
      alert('Notas guardadas correctamente');
    });
  }

  // 🔹 Validar rango
  validarNota(est: any) {
    if (est.nota < 0) est.nota = 0;
    if (est.nota > 5) est.nota = 5;
  }

  puedeEditar(): boolean {
    return (
      ['admin', 'profesor'].includes(this.user?.role) &&
      this.periodoActualEditable
    );
  }

  periodoEditable(): boolean {
    const periodoSeleccionado = Number(this.filtro.periodo);

    return this.periodosHabilitados.some(
      p => p.periodo === periodoSeleccionado
    );
  }

  onPeriodoChange() {
    this.periodoActualEditable = this.periodoEditable();
  }


  cargarPeriodos() {
    this.notasService.getPeriodos().subscribe((res: any) => {
      this.periodos = res.periodos;

      this.periodosHabilitados = this.periodos.filter(p => p.habilitado);

      if (this.periodosHabilitados.length === 1) {
        this.filtro.periodo = this.periodosHabilitados[0].periodo;
      }
    });
  }

  guardarConfiguracion() {
    this.notasService.actualizarPeriodos(this.periodos).subscribe({
      next: () => {
        alert('Configuración guardada correctamente');
      },
      error: err => {
        alert('Error al guardar configuración');
      }
    });
  }

}
