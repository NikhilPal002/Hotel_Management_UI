import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { CreateBooking } from '../models/create-booking.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-booking',
  imports: [RouterModule, FormsModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})

export class CreateBookingComponent implements OnInit {

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
      // Pre-fill the form with the room details
      this.model.roomId = this.roomDetails.roomId;
      // this.model.checkIn = this.roomDetails.checkInDate;
      // this.model.checkIn = this.roomDetails.checkOutDate;
    //   this.model.checkIn = this.formatDateForInput(this.roomDetails.checkInDate);
    // this.model.checkOut = this.formatDateForInput(this.roomDetails.checkOutDate);
 
      // Set any other room details if needed
    } else {
      // Handle the case where no room details were passed (e.g., redirect to the search page)
      this.router.navigate(['/']);
    }
  }

  onFormSubmit(): void {
    this.addBookingSubscription = this.bookingService.addBooking(this.model)
      .subscribe({
        next: () => {
          alert("Booking successful");
          this.router.navigateByUrl('receptionist/booking')
        }
      })
  }


}

