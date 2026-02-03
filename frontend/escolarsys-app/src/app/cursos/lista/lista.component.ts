import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  cursos: any[] = [];

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursosService.getCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error cargando cursos', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro de eliminar este curso?')) {
      this.cursosService.deleteCurso(id).subscribe(() => this.cargarCursos());
    }
  }
}
