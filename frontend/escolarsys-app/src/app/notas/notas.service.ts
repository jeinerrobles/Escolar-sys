import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  private api = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getGrados() {
    return this.http.get<any[]>(`${this.api}/grados`);
  }

  getNotasEstructura(cursoId: number, materiaId: number, periodo: number) {
    return this.http.get<any>(
      `${this.api}/notas/estructura?curso=${cursoId}&materia=${materiaId}&periodo=${periodo}`
    );
  }

  guardarNotas(data: any) {
    return this.http.post(`${this.api}/notas/guardar`, data);
  }
}
