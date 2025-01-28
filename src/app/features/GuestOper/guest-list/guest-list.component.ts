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
  guests$?:Observable<Guest[]> // Full list of guests
  paginatedGuests: Guest[] = []; // Current page of guests
  currentPage = 1; // Active page
  pageSize: number = 5; // Number of guests per page
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private guestService: GuestService) {}

  ngOnInit(): void {
    // Fetch guests from service
    this.guests$ = this.guestService.getAllGuest();
    this.guests$.subscribe((data) => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedGuests(data);
    });
  }

  // Updates the paginated list of guests
  updatePaginatedGuests(guests: Guest[]): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedGuests = guests.slice(startIndex, endIndex);
    }
  
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.guests$?.subscribe((data) => this.updatePaginatedGuests(data));
      }
    }
}
