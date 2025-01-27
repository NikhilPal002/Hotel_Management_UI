import { Component, OnInit } from '@angular/core';
import { Room } from '../models/searchRoom.model';
import { SearchRoomService } from '../services/search-room.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-room',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.css'
})


export class SearchRoomComponent implements OnInit {
  searchCriteria = {
    numberOfBeds: null as number | null,
    checkInDate: null as string | null,  // Change the type to string | null
    checkOutDate: null as string | null  // Change the type to string | null
  };
  rooms: Room[] = [];  // Type the rooms array as Room[]
  errorMessage: string = '';

  constructor(private roomService: SearchRoomService,
    private router:Router
  ) { }

  ngOnInit(): void { }

  onSearch(): void {
    // Reset error message and rooms list
    this.errorMessage = '';
    this.rooms = [];

    // Format the date values to strings in yyyy-MM-dd format
    let formattedCheckInDate = this.searchCriteria.checkInDate ? this.formatDate(this.searchCriteria.checkInDate) : null;
    let formattedCheckOutDate = this.searchCriteria.checkOutDate ? this.formatDate(this.searchCriteria.checkOutDate) : null;

    // console.log(`Request URL: http://localhost:5153/api/SearchRoom?numberOfBeds=${this.searchCriteria.numberOfBeds}&checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`);
    // Update the search criteria with formatted dates
    this.searchCriteria.checkInDate = formattedCheckInDate;
    this.searchCriteria.checkOutDate = formattedCheckOutDate;

    // Call the service to fetch the room data
    this.roomService.searchRooms(this.searchCriteria).subscribe(
      (response) => {
        if (response.success) {
          this.rooms = response.data;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching rooms. Please try again later.';
      }
    );
  }

  // Helper method to format the date to yyyy-MM-dd
  formatDate(date: string): string {
    let d = new Date(date);
    return d.toISOString().split('T')[0];  // This gives the date in yyyy-MM-dd format
  }

  // New method to handle booking a room
  onBookRoom(room: Room): void {
    this.router.navigate(['/receptionist/booking/add'], {
      state: { roomDetails: room }  // Pass room details to booking form
    });
  }
}