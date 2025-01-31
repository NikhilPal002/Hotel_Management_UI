import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddRoom } from '../models/add-room.model';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { nextTick } from 'process';
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-rooms',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-rooms.component.html',
  styleUrl: './add-rooms.component.css'
})

export class AddRoomsComponent implements OnDestroy {
  @Output() roomAdded = new EventEmitter<void>();
  model: AddRoom;

  private addRoomSubscription?: Subscription;

  constructor(private roomService: RoomService,
    private router: Router
  ) {
    this.model = {
      roomType: '',
      description: '',
      numberOfBeds: 0,
      pricePerNight: 0,
      status: ''
    };
  }


  onFormSubmit() {
    this.addRoomSubscription = this.roomService.addRoom(this.model)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Room Added!',
            text: 'Room has been successfully added.',
            timer: 2000,
            showConfirmButton: false
          });
          this.roomAdded.emit();
          // this.router.navigateByUrl('/manager/room');
        },

        error: (err) => {
          const errors = this.extractErrorMessages(err);

          Swal.fire({
            icon: 'error',
            title: 'Room Add Failed',
            html: errors.join('<br>'),
          });
        }
      })
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }

  ngOnDestroy(): void {
    this.addRoomSubscription?.unsubscribe();
  }


}
