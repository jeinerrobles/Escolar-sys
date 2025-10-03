import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../cursos.service';

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  curso: any = { nombre: '', descripcion: '', profesorId: null, estudiantesIds: [] };
  profesores: any[] = [];
  estudiantes: any[] = [];

  constructor(
    private cursosService: CursosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar curso
    this.cursosService.getCurso(id).subscribe((data) => {
      this.curso = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        profesorId: data.profesor?.id,
        estudiantesIds: data.estudiantes?.map((e: any) => e.id) || []
      };
    });

    // Cargar profesores y estudiantes
    this.cursosService.getProfesores().subscribe((data) => (this.profesores = data));
    this.cursosService.getEstudiantes().subscribe((data) => (this.estudiantes = data));
  }

  actualizarCurso() {
    this.cursosService.updateCurso(this.curso.id, this.curso).subscribe(() => {
      this.router.navigate(['/cursos']);
    });
  }
}

