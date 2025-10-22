import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 IMPORTANTE
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule // 👈 AGREGA ESTO
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutsModule { }
