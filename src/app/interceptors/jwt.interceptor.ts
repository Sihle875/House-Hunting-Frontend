// src/app/interceptors/jwt.interceptor.ts

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Skip token for auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') || 
                         req.url.includes('/auth/register') ||
                         req.url.includes('/auth/refresh');

  if (isAuthEndpoint) {
    return next(req);
  }

  // Add JWT token to request headers
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        // Try to refresh token
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Retry original request with new token
              const newToken = authService.getToken();
              if (newToken) {
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(clonedReq);
              }
              return throwError(() => error);
            }),
            catchError(refreshError => {
              // Refresh failed, logout user
              authService.logout();
              router.navigate(['/sign-in']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // No refresh token, logout
          authService.logout();
          router.navigate(['/sign-in']);
        }
      }

      // Handle 403 Forbidden errors
      if (error.status === 403) {
        console.error('Access forbidden');
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};