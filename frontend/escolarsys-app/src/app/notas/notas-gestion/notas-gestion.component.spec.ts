import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasGestionComponent } from './notas-gestion.component';

describe('NotasGestionComponent', () => {
  let component: NotasGestionComponent;
  let fixture: ComponentFixture<NotasGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
