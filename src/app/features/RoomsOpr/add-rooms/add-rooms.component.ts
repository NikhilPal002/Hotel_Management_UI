import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddRoom } from '../models/add-room.model';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { nextTick } from 'process';
import { response } from 'express';

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
          alert('Room added successfully!');
          this.roomAdded.emit();
          // this.router.navigateByUrl('/manager/room');
        },

        error: (error) => {
          alert('Room add failed!');
        }
      })
  }

  ngOnDestroy(): void {
    this.addRoomSubscription?.unsubscribe();
  }


}
