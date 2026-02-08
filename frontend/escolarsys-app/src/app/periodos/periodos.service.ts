import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeriodosService {

  private api = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getPeriodos() {
    return this.http.get<any[]>(`${this.api}/periodos`);
  }

  actualizarPeriodos(periodos: any[]) {
    return this.http.put(`${this.api}/periodos`, { periodos });
  }

}
