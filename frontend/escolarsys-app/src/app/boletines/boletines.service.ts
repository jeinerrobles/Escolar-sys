import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoletinesService {

  private api = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getBoletinEstudiante(estudianteId: number, cursoId: number) {
    return this.http.get(
      `${this.api}/boletines/${estudianteId}/${cursoId}`
    );
  }

  getGradosParaBoletines() {
    return this.http.get<any[]>(`${this.api}/grados?modulo=boletines`);
  }

}
