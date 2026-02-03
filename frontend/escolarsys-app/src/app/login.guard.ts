import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🔒 Si YA está logueado → no puede ver login
  if (authService.isLoggedIn()) {
    router.navigate(['/panel/cursos']);
    return false;
  }

  // ✅ Si NO está logueado → puede entrar a login
  return true;
};
