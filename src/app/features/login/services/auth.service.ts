import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../../environments/environment';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(request: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/login`, {
      email: request.email,
      passwordHash: request.passwordHash
    });
  }

  setUser(user: User): void {
    this.$user.next(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-roles', user.roles.join(','));
    }
  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const email = localStorage.getItem('user-email');
      const roles = localStorage.getItem('user-roles');

      if (email && roles) {
        return {
          email: email,
          roles: roles.split(',')
        } as User;
      }
    }
    return undefined;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}
