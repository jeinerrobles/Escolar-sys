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
  grados: any[] = [];

  constructor(
    private cursosService: CursosService,
    private gradoService: GradoService,
    private router: Router) { }

  ngOnInit() {
    this.cursosService.getProfesores().subscribe((data) => {
      this.profesores = data;
    });

    this.cursosService.getEstudiantes().subscribe((data) => {
      this.estudiantes = data;
    });

    this.gradoService.getGrados().subscribe((data) => {
      this.grados = data;
    });
  }

  toggleAllEstudiantes() {
    this.estudiantes.forEach((e) => (e.seleccionado = this.selectAll));
  }

  crearCurso() {
    // Recolectar IDs seleccionados
    this.curso.estudiantesIds = this.estudiantes
      .filter((e) => e.seleccionado)
      .map((e) => e.id);

    this.cursosService.createCurso(this.curso).subscribe(() => {
      Swal.fire({
        title: 'Curso creado',
        text: 'Curso creado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        this.router.navigate(['/cursos']);
      });
    });
  }
}
