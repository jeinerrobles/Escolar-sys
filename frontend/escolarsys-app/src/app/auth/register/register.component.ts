import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Role } from '../../core/models/role';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  role: Role = Role.ESTUDIANTE; // ✅ enum
  Role = Role; // ✅ para el HTML

  error = '';
  success = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    const userData = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      role: this.role // ✅ nombre correcto
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.success = 'Usuario registrado correctamente';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrar';
        this.success = '';
      }
    });
  }
}
