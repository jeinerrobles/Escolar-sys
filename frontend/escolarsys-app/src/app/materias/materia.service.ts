import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MateriaService {
  private apiUrl = 'http://localhost:4000/api/materias';
  private apiUrlUsers = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMateriaById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
  }

  createMateria(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateMateria(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUsers}/profesores`);
  }
}
