import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface DecodedToken {
  id: number;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth'; // tu backend

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((res: any) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user)); // 👈 guardar datos del usuario
    })
  );
}

  register(data: { nombre: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
  const user = this.getCurrentUser();
  return user ? user.role : null;
  }
  
}
