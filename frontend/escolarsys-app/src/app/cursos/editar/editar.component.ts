import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  curso: any = { nombre: '', descripcion: '', profesorId: null, estudiantesIds: [] };
  profesores: any[] = [];
  estudiantes: any[] = [];
  selectAll: boolean = false;

  constructor(
    private cursosService: CursosService,
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
        estudiantesIds: data.estudiantes?.map((e: any) => e.id) || []
      };

      // Cargar estudiantes y marcar seleccionados
      this.cursosService.getEstudiantes().subscribe((estudiantes) => {
        this.estudiantes = estudiantes.map((e: any) => ({
          ...e,
          seleccionado: this.curso.estudiantesIds.includes(e.id)
        }));
      });
    });

    // Cargar profesores
    this.cursosService.getProfesores().subscribe((data) => (this.profesores = data));
  }

  toggleAllEstudiantes() {
    this.estudiantes.forEach((e) => (e.seleccionado = this.selectAll));
  }

  actualizarCurso() {
    // Recolectar IDs seleccionados
    this.curso.estudiantesIds = this.estudiantes
      .filter((e) => e.seleccionado)
      .map((e) => e.id);

    this.cursosService.updateCurso(this.curso.id, this.curso).subscribe(() => {
      Swal.fire({
        title: 'Curso Actualizado',
        text: 'Curso actualizado correctamente',
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


