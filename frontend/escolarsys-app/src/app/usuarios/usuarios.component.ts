import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuariosOriginal: any[] = [];
  usuariosFiltrados: any[] = [];
  usuariosPaginados: any[] = [];

  loading = true;

  // 🔹 Filtro
  terminoBusqueda: string = '';

  // 🔹 Paginación
  paginaActual = 1;
  registrosPorPagina = 5;
  totalPaginas = 1;

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        this.usuariosOriginal = res;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios. Por favor cierre sesión y vuelva a ingresar.', 'error');
      }
    });
  }

  // 🔹 FILTRO
  aplicarFiltro() {
    if (!this.terminoBusqueda) {
      this.usuariosFiltrados = [...this.usuariosOriginal];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.usuariosFiltrados = this.usuariosOriginal.filter(u =>
        u.nombre.toLowerCase().includes(termino) ||
        u.email.toLowerCase().includes(termino) ||
        u.role.toLowerCase().includes(termino)
      );
    }

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  // 🔹 PAGINACIÓN
  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.registrosPorPagina);
    this.cambiarPagina(this.paginaActual);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;

    const inicio = (pagina - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este usuario se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario fue eliminado correctamente', 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }
}
