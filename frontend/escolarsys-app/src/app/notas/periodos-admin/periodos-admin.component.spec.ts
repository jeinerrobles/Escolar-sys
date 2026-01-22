import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosAdminComponent } from './periodos-admin.component';

describe('PeriodosAdminComponent', () => {
  let component: PeriodosAdminComponent;
  let fixture: ComponentFixture<PeriodosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodosAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
