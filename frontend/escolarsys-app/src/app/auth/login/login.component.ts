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
  success = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.success = 'Bienvenido a EscolarSys';
        this.error = '';
        setTimeout(() => this.router.navigate(['/cursos']), 1500);
      },
      error: err => {
        this.error = err.error.message || 'Error al iniciar sesión';
        this.success = '';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
  }
}

