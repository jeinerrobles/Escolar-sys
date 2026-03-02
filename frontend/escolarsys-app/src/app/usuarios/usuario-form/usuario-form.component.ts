import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  usuario = { nombre: '', email: '', password: '', role: 'estudiante' };
  editMode = false;
  id: number | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.editMode = true;
      this.usuariosService.getUsuario(this.id).subscribe((data) => {
        this.usuario = data;
      });
    }
  }

  guardarUsuario() {
    if (this.editMode) {
      this.usuariosService.updateUsuario(this.id!, this.usuario).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El usuario fue actualizado correctamente', 'success');
          this.router.navigate(['panel/usuarios']);
        },
          error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      });
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe({
        next: () => {
          Swal.fire('Creado', 'El usuario fue creado correctamente', 'success');
          this.router.navigate(['panel/usuarios']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el usuario', 'error');
        }
      });
    }
  }
}
