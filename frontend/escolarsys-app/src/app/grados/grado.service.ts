import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradoService {
  private apiUrl = 'http://localhost:4000/api/grados'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  /** 🔹 Obtener todos los grados */
  getGrados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 🔹 Obtener un grado por su ID */
  getGradoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Crear un nuevo grado */
  createGrado(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** 🔹 Actualizar un grado existente */
  updateGrado(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /** 🔹 Eliminar un grado */
  deleteGrado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
