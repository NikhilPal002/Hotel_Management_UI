import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { UpdateRoom } from '../models/update-room.model';

@Component({
  selector: 'app-update-rooms',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-rooms.component.html',
  styleUrl: './update-rooms.component.css'
})
export class UpdateRoomsComponent implements OnInit, OnDestroy {

  // id: number | null = null;
  paramsSubscription?: Subscription;
  updateRoomSubscription?: Subscription;
  room?: Room;

  @Input() roomId: number | null = null;
  @Output() closePopup = new EventEmitter<void>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }



  ngOnInit(): void {
    if (this.roomId) {

      this.paramsSubscription = this.roomService.getRoomById(this.roomId)
        .subscribe({
          next: (response) => {
            this.room = response;
          },
          error: (err) => {
            console.error('Failed to fetch room details:', err);
            alert('Room not found.');
          },
        });
    }
  }


  onFormSubmit(): void {
    if (!this.room) return;

    const updateRoom: UpdateRoom = {
      roomType: this.room?.roomType ?? '',
      description: this.room?.description ?? '',
      numberOfBeds: this.room?.numberOfBeds ?? 0,
      pricePerNight: this.room?.pricePerNight ?? 0,
      status: this.room?.status ?? '',
    }


    if (this.roomId) {
      this.updateRoomSubscription = this.roomService.updateRoom(this.roomId, updateRoom)
        .subscribe({
          next: (response) => {
            alert("Room updated successfully!");
            this.closePopup.emit();
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Guest not found or update failed!');
          }
        })
    }
  }

  onDelete(): void {
    if (this.roomId) {
      this.roomService.deleteRoom(this.roomId)
        .subscribe({
          next: (response) => {
            alert("Room deleted successfully")
            this.closePopup.emit();
            this.router.navigateByUrl('/manager/room')
          }
        });
    }
  }


  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateRoomSubscription?.unsubscribe();
  }



}
