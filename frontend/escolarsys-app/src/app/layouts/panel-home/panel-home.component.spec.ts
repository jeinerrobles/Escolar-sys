import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHomeComponent } from './panel-home.component';

describe('PanelHomeComponent', () => {
  let component: PanelHomeComponent;
  let fixture: ComponentFixture<PanelHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
