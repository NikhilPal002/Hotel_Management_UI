import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get JWT token from cookies
  const token = cookieService.get('Authorization');
  const user = authService.getUser();

  if (token && user) {
    try {
      const cleanToken = token.replace('Bearer', '').trim();
      const decodedToken: any = jwtDecode(cleanToken);

      // Check token expiration
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        authService.logout();
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }

      // Check user roles
      const allowedRoles = ['Receptionist', 'Manager'];
      if (allowedRoles.some((role) => user.roles.includes(role))) {
        return true; // User is authorized
      } else {
        console.warn('Unauthorized access attempt');
        return router.createUrlTree(['/unauthorized']);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      authService.logout();
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
  } else {
    authService.logout();
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
};
