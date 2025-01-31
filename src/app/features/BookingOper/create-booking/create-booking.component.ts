import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { CreateBooking } from '../models/create-booking.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-booking',
  imports: [RouterModule, FormsModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})

export class CreateBookingComponent implements OnInit, OnDestroy {

  roomDetails: any;
  model: CreateBooking;
  private addBookingSubscription?: Subscription;

  constructor(private bookingService: BookingService
    , private router: Router) {
    this.model = {
      numberOfAdults: 0,
      numberOfChildren: 0,
      checkIn: new Date(),
      checkOut: new Date(),
      guestId: 0,
      roomId: 0
    }
  }


  ngOnInit(): void {
    // Retrieve the room details passed from the SearchRoomComponent
    this.roomDetails = history.state.roomDetails;

    if (this.roomDetails) {
      this.model.roomId = this.roomDetails.roomId;
    } else {
      this.router.navigate(['/']);
    }
  }

  onFormSubmit(): void {
    this.addBookingSubscription = this.bookingService.addBooking(this.model)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Booking Created!',
            text: 'Booking has been successfully created.',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigateByUrl('receptionist/booking')
        },
        error: (err) => {
          const errors = this.extractErrorMessages(err);

          Swal.fire({
            icon: 'error',
            title: 'Booking Creation Failed',
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
    this.addBookingSubscription?.unsubscribe();
  }

}

