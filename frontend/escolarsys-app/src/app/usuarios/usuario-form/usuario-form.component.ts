import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
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
      this.usuariosService.updateUsuario(this.id!, this.usuario).subscribe(() => {
        Swal.fire({
            title: 'Usuario actualizado',
            text: 'Usuario actualizado correctamente',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['/usuarios']);
          });
      });
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe(() => {
        Swal.fire({
            title: 'Usuario creado',
            text: 'Usuario creado correctamente',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['/usuarios']);
          });
      });
    }
  }
}
