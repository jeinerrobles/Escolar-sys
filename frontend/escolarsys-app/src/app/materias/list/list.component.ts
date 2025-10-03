import { Component, OnInit } from '@angular/core';
import { MateriasService } from '../materias.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  materias: any[] = [];

  constructor(private materiasService: MateriasService) {}

  ngOnInit() {
    this.materiasService.getAll().subscribe({
      next: data => this.materias = data,
      error: err => console.error(err)
    });
  }
}
