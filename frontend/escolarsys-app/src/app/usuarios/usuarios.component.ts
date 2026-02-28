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
  usuarios: any[] = [];
  loading = true;

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios. Por favor cierre sesión y vuelva a ingresar.', 'error');
      }
    });
  }

  editarUsuario(id: number) {
    this.router.navigate(['/usuarios/editar', id]);
  }

  nuevoUsuario() {
    this.router.navigate(['/usuarios/nuevo']);
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
