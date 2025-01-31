import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from './models/login.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { response } from 'express';
import { CookieService } from 'ngx-cookie-service'
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  model: Login;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      passwordHash: ''
    }
  }

  onFormSubmit(): void {
    this.authService.login(this.model)
      .subscribe({
        next: (response) => {
          // set auth cookie
          this.cookieService.set('Authorization', `Bearer ${response.token}`,
            undefined, '/', undefined, true, 'Strict'
          )

          //set user
          this.authService.setUser({
            email: response.email,
            roles: response.roles
          })

          Swal.fire({
            icon: 'success',
            title: 'Login Success!',
            text: 'Logged in successfully.',
            timer: 2000,
            showConfirmButton: false
          });

          // Redirect
          this.router.navigateByUrl('/');

        },
        error: (err) => {
          const errors = this.extractErrorMessages(err);

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            html: errors.join('<br>'),
          });
        }
      })
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }
}
