import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'; // 👈 IMPORTANTE
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'materias', loadChildren: () => import('./materias/materias.module').then(m => m.MateriasModule) },
      { path: 'cursos', loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosModule) }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

