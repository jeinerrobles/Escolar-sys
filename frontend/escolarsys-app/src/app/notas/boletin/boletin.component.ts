import { Component, OnInit } from '@angular/core';
import { NotasService } from '../notas.service';

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

  constructor(private notasService: NotasService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cargarGrados();
  }

  // 🔹 Grados
  cargarGrados() {
    this.notasService.getGrados().subscribe(res => {
      this.grados = res;
    });
  }

  // 🔹 Al seleccionar grado
  onGradoChange() {
    this.cursos = this.filtro.grado?.cursos || [];
    this.estudiantes = [];
    this.filtro.curso = null;
    this.filtro.estudiante = null;
    this.boletin = [];
  }

  // 🔹 Al seleccionar curso
  onCursoChange() {
    this.estudiantes = this.filtro.curso?.estudiantes || [];
    this.filtro.estudiante = null;
    this.boletin = [];
  }

  // 🔹 Cargar boletín
  cargarBoletin() {
    if (!this.filtro.estudiante) {
      alert('Debe seleccionar un estudiante');
      return;
    }

    this.loading = true;
    this.mostrarBoletin = false;

    this.notasService
      .getBoletinEstudiante(
        this.filtro.estudiante.id,
        this.filtro.curso.id
      )
      .subscribe(res => {
        this.boletin = res;
        this.loading = false;
        this.mostrarBoletin = true;
      });
  }

}
