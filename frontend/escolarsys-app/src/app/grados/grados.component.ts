import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GradoService } from './grado.service';


@Component({
  selector: 'app-grados-list',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.scss']
})
export class GradosComponent implements OnInit {
  grados: any[] = [];
  loading = false;

  mostrarModal = false;
  modalTitulo = '';
  modalLista: any[] = [];
  busqueda = '';

  constructor(private gradoService: GradoService, private router: Router) { }

  ngOnInit(): void {
    this.cargarGrados();
  }

  cargarGrados(): void {
    this.loading = true;
    this.gradoService.getGrados().subscribe({
      next: (res) => {
        this.grados = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
      }
    });
  }


  abrirModal(titulo: string, lista: any[]) {
    this.modalTitulo = titulo;
    this.modalLista = lista ?? []; // <-- evitar undefined
    this.busqueda = '';
    this.mostrarModal = true;
  }


  cerrarModal() {
    this.mostrarModal = false;
  }


  verCursos(grado: any) {
    const lista = grado.cursos ?? [];
    this.abrirModal(`Cursos de ${grado.nombre} (${lista.length})`, lista);
  }


  verMaterias(grado: any) {
    const lista = grado.materias ?? [];
    this.abrirModal(`Materias de ${grado.nombre} (${lista.length})`, lista);
  }


  verEstudiantes(grado: any) {
    const cursos = grado.cursos ?? [];

    const estudiantes = cursos
      .flatMap((c: any) => c.estudiantes ?? [])
      .filter((e: any, index: number, self: any[]) =>
        index === self.findIndex(t => t.id === e.id)
      );

    this.abrirModal(
      `Estudiantes de ${grado.nombre} (${estudiantes.length})`,
      estudiantes
    );
  }


  filtrarLista() {
    if (!this.busqueda) return this.modalLista;
    const texto = this.busqueda.toLowerCase();

    return this.modalLista.filter(item =>
      item.nombre?.toLowerCase().includes(texto)
    );
  }

  nuevoGrado(): void {
    this.router.navigate(['/grados/nuevo']);
  }

  editarGrado(grado: any): void {
    this.router.navigate(['/grados/editar', grado.id]);
  }

  eliminarGrado(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este grado se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gradoService.deleteGrado(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El grado fue eliminado correctamente', 'success');
            this.cargarGrados();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
          }
        });
      }
    });
  }
}
