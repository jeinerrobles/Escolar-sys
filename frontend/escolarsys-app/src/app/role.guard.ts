import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from './core/models/role';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole() as Role | null;
  const allowedRoles = route.data?.['roles'] as Role[];

  // Sin sesión
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Ruta sin roles → permitir
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Rol no permitido
  if (!allowedRoles.includes(userRole)) {
    switch (userRole) {
      case Role.ADMIN:
      case Role.DOCENTE:
        router.navigate(['/cursos']);
        break;

      case Role.ESTUDIANTE:
        router.navigate(['/notas']);    
        break;

      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true;
};
