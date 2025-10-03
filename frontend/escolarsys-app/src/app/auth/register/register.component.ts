import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  role = 'estudiante';
  error = '';
  success = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const userData = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.success = 'Usuario registrado correctamente';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error.message || 'Error al registrar';
        this.success = '';
      }
    });
  }
}
