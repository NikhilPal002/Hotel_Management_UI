import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuestService } from '../services/guest.service';
import { response } from 'express';
import { Guest } from '../models/guest.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { GuestsComponent } from '../guests/guests.component';
import { UpdateGuestComponent } from '../update-guest/update-guest.component';

declare var bootstrap: any;

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, GuestsComponent, UpdateGuestComponent],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent implements OnInit {
  guests$?: Observable<Guest[]> // Full list of guests
  paginatedGuests: Guest[] = []; // Current page of guests
  currentPage = 1; // Active page
  pageSize: number = 5; // Number of guests per page
  totalPages: number = 0;
  pages: number[] = [];

  selectedGuestId: number | null = null;


  @ViewChild('addGuestModal', { static: false }) addGuestModal!: ElementRef;

  constructor(private guestService: GuestService) { }

  ngOnInit(): void {

    this.loadGuests();
  }

  loadGuests(): void {
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

  closeModal() {
    let modalElement = document.getElementById('addGuestModal')
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.loadGuests();
    }
  }

  openEditGuestModal(guestId: number): void {
    this.selectedGuestId = guestId;

    setTimeout(() => {
      let modalElement = document.getElementById('editGuestModal');
      if (modalElement) {
        let modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Move focus to the modal
        modalElement.setAttribute('tabindex', '-1');
        modalElement.focus();
      }
    }, 100);
  }

  closeEditModal(): void {
    let modalElement = document.getElementById('editGuestModal');
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      // Refresh the guest list after closing the edit modal
      this.loadGuests();

      // Reset selected guest to allow loading a new one
      this.selectedGuestId = null;
    }
  }


}
