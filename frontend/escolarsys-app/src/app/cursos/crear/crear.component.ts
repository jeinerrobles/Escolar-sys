import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursosService } from '../cursos.service';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {
  curso = { nombre: '', descripcion: '', profesorId: null, estudiantesIds: [] };
  profesores: any[] = [];
  estudiantes: any[] = [];

  constructor(
    private cursosService: CursosService,
    private router: Router) {}

  ngOnInit() {
    this.cursosService.getProfesores().subscribe((data) => {
      this.profesores = data;
    });

    this.cursosService.getEstudiantes().subscribe((data) => {
      this.estudiantes = data;
    });
  }

  crearCurso() {
    this.cursosService.createCurso(this.curso).subscribe(() => {
      this.router.navigate(['/cursos']);
    });
  }
}
