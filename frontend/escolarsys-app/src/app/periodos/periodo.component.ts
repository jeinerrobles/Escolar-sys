import { Component } from '@angular/core';
import { PeriodosService } from './periodos.service';
import Swal from "sweetalert2";

interface Periodo {
  id: number;
  periodo: number;
  habilitado: boolean;
}

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent {
  periodos: Periodo[] = [];
  loading = false;

  constructor(private periodosService: PeriodosService) {}

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.periodosService.getPeriodos().subscribe({
      next: (res: any) => {
        // AQUÍ ESTÁ LA CLAVE
        this.periodos = res.periodos.map((p: any) => ({
          id: Number(p.id),
          periodo: p.periodo,
          habilitado: !!p.habilitado
        }));
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los periodos académicos. Por favor cierre sesión y vuelva a ingresar.', 'error');
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

    this.periodosService.actualizarPeriodos(this.periodos).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Actualizado', 'El periodo académico fue actualizado correctamente', 'success');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire('Error', 'No fue posible actualizar el periodo académico', 'error');
      }
    });
  }
}
