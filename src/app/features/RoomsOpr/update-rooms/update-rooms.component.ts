import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

  id: number | null = null;
  paramsSubscription?: Subscription;
  updateRoomSubscription?: Subscription;
  room?: Room;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }



  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        this.id = idParam ? parseInt(idParam, 10) : null;

        if (this.id) {
          this.roomService.getRoomById(this.id)
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
    });
  }

  onFormSubmit(): void {
    const updateRoom: UpdateRoom = {
      roomType: this.room?.roomType ?? '',
      description: this.room?.description ?? '',
      numberOfBeds: this.room?.numberOfBeds ?? 0,
      pricePerNight: this.room?.pricePerNight ?? 0,
      status: this.room?.status ?? '',
    }


    if (this.id) {
      this.updateRoomSubscription = this.roomService.updateRoom(this.id, updateRoom)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/manager/room')
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Guest not found or update failed!');
          }
        })
    }
  }

  onDelete(): void {
    if (this.id) {
      this.roomService.deleteRoom(this.id)
      .subscribe({
        next:(response)=>{
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
