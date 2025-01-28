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
  pageSize: number = 6;  // Number of rooms per page
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private roomService: RoomService) {

  }

  
  ngOnInit(): void {
    this.rooms$ = this.roomService.getAllRoom();
    this.rooms$.subscribe((data) => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedRooms(data);
    });
    
  }

  updatePaginatedRooms(rooms: Room[]): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedRooms = rooms.slice(startIndex, endIndex);
    }
  
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.rooms$?.subscribe((data) => this.updatePaginatedRooms(data));
      }
    }

}
