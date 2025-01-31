import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { UpdateRoom } from '../models/update-room.model';
import Swal from 'sweetalert2';

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
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Room Not Found',
              html: errors.join('<br>'),
            });
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
            Swal.fire({
              icon: 'success',
              title: 'Room Updated!',
              text: 'Room has been successfully updated.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
          },
          error: (error) => {
            const errors = this.extractErrorMessages(error);

            Swal.fire({
              icon: 'error',
              title: 'Room Update Failed',
              html: errors.join('<br>'),
            });
          }
        })
    }
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }

  onDelete(): void {
    if (this.roomId) {
      this.roomService.deleteRoom(this.roomId)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Room Deleted!',
              text: 'Room has been successfully deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
            this.router.navigateByUrl('/manager/room')
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Room Delete Failed',
              html: errors.join('<br>'),
            });
          }
        });
    }
  }


  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateRoomSubscription?.unsubscribe();
  }



}
