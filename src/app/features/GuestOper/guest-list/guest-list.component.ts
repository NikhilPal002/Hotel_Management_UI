import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestService } from '../services/guest.service';
import { response } from 'express';
import { Guest } from '../models/guest.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent implements OnInit {
  guests$?: Observable<Guest[]>;
  
  constructor(private guestService: GuestService){

  }

  ngOnInit(): void {
     this.guests$ = this.guestService.getAllGuest();
  }
}
