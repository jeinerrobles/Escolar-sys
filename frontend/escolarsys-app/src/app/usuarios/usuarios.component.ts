import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { Router } from '@angular/router';

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
      error: () => {
        this.loading = false;
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
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}
