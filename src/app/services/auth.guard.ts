import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (localStorage.getItem('token')) {
    return true;
  }
  
  // Guardar la URL solicitada para redirigir después del login
  router.navigate(['/login'], { 
    queryParams: { 
      returnUrl: state.url 
    } 
  });
  
  return false;
};