import { Component } from '@angular/core';
import { NotasService } from '../notas.service';

interface Periodo {
  id: number;
  periodo: number;
  habilitado: boolean;
}

@Component({
  selector: 'app-periodos-admin',
  templateUrl: './periodos-admin.component.html',
  styleUrls: ['./periodos-admin.component.scss']
})
export class PeriodosAdminComponent {
   periodos: Periodo[] = [];
  loading = false;

  constructor(private notasService: NotasService) {}

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.notasService.getPeriodos().subscribe({
      next: (res: any) => {
        // 👇 AQUÍ ESTÁ LA CLAVE
        this.periodos = res.periodos.map((p: any) => ({
          id: Number(p.id),
          periodo: p.periodo,
          habilitado: !!p.habilitado
        }));
      },
      error: () => {
        alert('Error al cargar periodos');
      }
    });
  }

  togglePeriodo(periodo: Periodo): void {

  if (periodo.habilitado) {
    this.periodos = this.periodos.map(p => ({
      ...p,
      habilitado: false
    }));
  } 
  else {
    this.periodos = this.periodos.map(p => ({
      ...p,
      habilitado: p.id === periodo.id
    }));
  }

  this.guardarConfiguracion();
}


  guardarConfiguracion(): void {
    this.loading = true;

    this.notasService.actualizarPeriodos(this.periodos).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Error al guardar configuración');
      }
    });
  }
}
