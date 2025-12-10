// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check for required roles if specified in route data
    const requiredRoles = route.data['roles'] as string[];
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (authService.hasAnyRole(requiredRoles)) {
        return true;
      } else {
        // User doesn't have required role
        router.navigate(['/unauthorized']);
        return false;
      }
    }
    
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate(['/sign-in'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};

// Optional: Role-specific guard
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};