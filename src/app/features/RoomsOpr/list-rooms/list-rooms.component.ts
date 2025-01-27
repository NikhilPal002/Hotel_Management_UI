import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-list-rooms',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-rooms.component.html',
  styleUrl: './list-rooms.component.css'
})
export class ListRoomsComponent implements OnInit {
  rooms$?: Observable<Room[]>
  paginatedRooms: Room[] = []; // Array to store current page rooms
  currentPage: number = 1; // Track current page
  itemsPerPage: number = 5;  // Number of rooms per page
  totalPages: number = 1;

  constructor(private roomService: RoomService) {

  }

  
  ngOnInit(): void {
    this.rooms$ = this.roomService.getAllRoom();
    
  }

}
