import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}