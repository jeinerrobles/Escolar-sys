import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Role } from '../core/models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =====================
  // LOGIN
  // =====================
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        // Guardar token
        localStorage.setItem('token', res.token);

        // Guardar usuario (id + role)
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  // =====================
  // REGISTER
  // =====================
  register(data: {
    nombre: string;
    email: string;
    password: string;
    role: Role;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // =====================
  // LOGOUT
  // =====================
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // =====================
  // SESSION HELPERS
  // =====================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { id: number; role: Role } | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole(): Role | null {
    const user = this.getCurrentUser();
    return user?.role ?? null;
  }
}
