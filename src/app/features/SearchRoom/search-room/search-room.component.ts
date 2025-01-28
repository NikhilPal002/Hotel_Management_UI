import { Component, OnInit } from '@angular/core';
import { Room } from '../models/searchRoom.model';
import { SearchRoomService } from '../services/search-room.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-search-room',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.css'
})


export class SearchRoomComponent implements OnInit {
  searchCriteria = {
    numberOfBeds: null as number | null,
    checkInDate: null as string | null,
    checkOutDate: null as string | null

  };

  
  rooms: Room[] = [];
  paginatedRooms: Room[] = [];
  errorMessage: string = '';

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private roomService: SearchRoomService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize empty room data
    this.rooms = [];
    this.updatePagination();
  }

  updatePagination(): void {
    // Update total pages and the list of pages
    this.totalPages = Math.ceil(this.rooms.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedRooms();
  }

  updatePaginatedRooms(): void {
    // Slice the full room list to get data for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRooms = this.rooms.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    // Change the current page and update the paginated room list
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRooms();
    }
  }

  onSearch(): void {
    this.errorMessage = '';
    this.rooms = [];
    this.paginatedRooms = [];
    this.currentPage = 1; // Reset to the first page for new search results

    // Format the date values to strings in yyyy-MM-dd format
    const formattedCheckInDate = this.searchCriteria.checkInDate
      ? this.formatDate(this.searchCriteria.checkInDate)
      : null;
    const formattedCheckOutDate = this.searchCriteria.checkOutDate
      ? this.formatDate(this.searchCriteria.checkOutDate)
      : null;

    // Update the search criteria with formatted dates
    this.searchCriteria.checkInDate = formattedCheckInDate;
    this.searchCriteria.checkOutDate = formattedCheckOutDate;

    // Call the service to fetch the room data
    this.roomService
      .searchRooms(this.searchCriteria)
      .pipe(
        catchError((error) => {
          this.errorMessage = error.error.message || 
            'An error occurred while fetching rooms. Please try again later.';
          return of({ success: false, data: [], message: this.errorMessage });
        })
      )
      .subscribe((response) => {
        if (response.success) {
          this.rooms = response.data; // Store the full room data
          this.updatePagination(); // Recalculate pagination and update paginated data
        } else {
          this.errorMessage = response.message;
        }
      });
  }

  // Helper method to format the date to yyyy-MM-dd
  formatDate(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // This gives the date in yyyy-MM-dd format
  }

  // Method to handle booking a room
  onBookRoom(room: Room): void {
    this.router.navigate(['/receptionist/booking/add'], {
      state: { roomDetails: room } // Pass the room details to the booking page
    });
  }

}