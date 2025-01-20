import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from './models/login.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { response } from 'express';
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  model:Login;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ){
    this.model ={
      email:'',
      passwordHash: ''
    }
  }

  onFormSubmit(): void{
    this.authService.login(this.model)
    .subscribe({
      next:(response)=>{
        // set auth cookie
        this.cookieService.set('Authorization',`Bearer ${response.token}`,
          undefined,'/',undefined,true,'Strict'
        )

        //set user
        this.authService.setUser({
          email:response.email,
          roles:response.roles
        })
        
        // Redirect
        this.router.navigateByUrl('/');

      }
    })
  }
}
