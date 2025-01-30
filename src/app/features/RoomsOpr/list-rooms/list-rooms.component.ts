import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { UpdateRoomsComponent } from "../update-rooms/update-rooms.component";
import { AddRoomsComponent } from "../add-rooms/add-rooms.component";

declare var bootstrap: any;

@Component({
  selector: 'app-list-rooms',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, UpdateRoomsComponent, AddRoomsComponent],
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

  selectedRoomId: number | null = null;

  @ViewChild('addRoomModal', { static: false }) addRoomModal!: ElementRef;


  constructor(private roomService: RoomService) {

  }


  ngOnInit(): void {

    this.loadRooms();
  }

  loadRooms(): void {
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

  closeModal() {
    let modalElement = document.getElementById('addRoomModal')
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.loadRooms();
    }
  }

  openEditRoomModal(roomId: number): void {
    this.selectedRoomId = roomId;

    setTimeout(() => {
      let modalElement = document.getElementById('editRoomModal');
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
    let modalElement = document.getElementById('editRoomModal');
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      // Refresh the guest list after closing the edit modal
      this.loadRooms();

      // Reset selected guest to allow loading a new one
      this.selectedRoomId = null;
    }
  }

}
