import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../features/login/services/auth.service';
import { response } from 'express';
import { User } from '../../features/login/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  user?: User;

  constructor(private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.authService.user()
      .subscribe({
        next: (response) => {
          this.user = response;
        }
      });

    this.user = this.authService.getUser();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

}
