import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está logueado  mándalo al panel 
  if (authService.isLoggedIn()) {
    router.navigate(['/panel']);
    return false;
  }

  return true;
};
