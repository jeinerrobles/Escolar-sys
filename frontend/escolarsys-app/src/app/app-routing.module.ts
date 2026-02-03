import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';
import { roleGuard } from './role.guard';
import { Role } from './core/models/role';

const routes: Routes = [
  // =====================
  // HOME PÚBLICO
  // =====================
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule)
  },

  // =====================
  // AUTH
  // =====================
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginGuard]
  },

  // =====================
  // PANEL PRIVADO
  // =====================
  {
    path: 'panel',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },

      {
        path: 'cursos',
        loadChildren: () =>
          import('./cursos/cursos.module').then(m => m.CursosModule)
      },

      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] }
      },

      {
        path: 'materias',
        loadChildren: () =>
          import('./materias/materias.module').then(m => m.MateriasModule)
      },

      {
        path: 'grados',
        loadChildren: () =>
          import('./grados/grados.module').then(m => m.GradosModule)
      },

      {
        path: 'notas',
        loadChildren: () =>
          import('./notas/notas.module').then(m => m.NotasModule),
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.DOCENTE, Role.ESTUDIANTE] }
      }

    ]
  },

  // =====================
  // REDIRECCIONES
  // =====================
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
