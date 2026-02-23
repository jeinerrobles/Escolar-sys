import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';

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
      error: (err) => console.error('Error cargando cursos', err)
    });
  }

  //  Eliminar curso (solo admin)
  eliminar(id: number) {
    if (confirm('¿Seguro de eliminar este curso?')) {
      this.cursosService.deleteCurso(id)
        .subscribe(() => this.cargarCursos());
    }
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