import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
    private apiUrl = 'http://localhost:4000/api/cursos'; // Ajusta al backend
    private apiUrlUsers = 'http://localhost:4000/api/users'; // Ajusta al backend

    constructor(private http: HttpClient) { }

    getCursos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getCurso(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createCurso(curso: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, curso);
    }

    updateCurso(id: number, curso: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, curso);
    }

    deleteCurso(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getProfesores(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrlUsers}/profesores`);
    }

    getEstudiantes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrlUsers}/estudiantes`);
    }
}
