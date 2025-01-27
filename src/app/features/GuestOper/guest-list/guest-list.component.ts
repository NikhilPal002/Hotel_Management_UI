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
  guests: Guest[] = []; // Full list of guests
  paginatedGuests: Guest[] = []; // Current page of guests
  currentPage = 1; // Active page
  itemsPerPage = 5; // Number of guests per page
  totalPages = 0; // Total pages available

  constructor(private guestService: GuestService) {}

  ngOnInit(): void {
    // Fetch guests from service
    this.guestService.getAllGuest().subscribe((data) => {
      this.guests = data;
      this.totalPages = Math.ceil(this.guests.length / this.itemsPerPage);
      this.updatePaginatedGuests();
    });
  }

  // Updates the paginated list of guests
  updatePaginatedGuests(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedGuests = this.guests.slice(startIndex, endIndex);
  }

  // Navigates to the specified page
  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedGuests();
  }

  // Handles previous page navigation
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedGuests();
    }
  }

  // Handles next page navigation
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedGuests();
    }
  }
}
