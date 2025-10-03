import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private apiUrl = 'http://localhost:4000/api/materias';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  asignarProfesor(data: { idMateria: number; idProfesor: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar-profesor`, data);
  }

  inscribirEstudiante(data: { idMateria: number; idEstudiante: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscribir-estudiante`, data);
  }
}
