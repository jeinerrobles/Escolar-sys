import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        //  Guardar sesión ANTES de navegar
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.success = 'Bienvenido a EscolarSys';

        const role = res.user.role;

        //  Redirección por rol
        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/panel/cursos']);
            break;

          case 'DOCENTE':
          case 'ESTUDIANTE':
            this.router.navigate(['/panel/notas']);
            break;

          default:
            this.router.navigate(['/panel']);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}

