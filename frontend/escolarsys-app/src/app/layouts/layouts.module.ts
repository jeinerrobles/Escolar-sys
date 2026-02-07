import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 IMPORTANTE
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PanelHomeComponent } from './panel-home/panel-home.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    PanelHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule 
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutsModule { }
