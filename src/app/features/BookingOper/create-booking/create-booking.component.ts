import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { CreateBooking } from '../models/create-booking.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-booking',
  imports: [RouterModule,FormsModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})

export class CreateBookingComponent {

  model:CreateBooking;
  private addBookingSubscription?: Subscription;

  constructor(private bookingService:BookingService
    ,private router:Router){ 
      this.model ={
        numberOfAdults:0,
        numberOfChildren:0,
        checkIn: new Date(),
        checkOut: new Date(),
        guestId:0,
        roomId:0
      }
    }

    onFormSubmit(): void{
        this.addBookingSubscription = this.bookingService.addBooking(this.model)
        .subscribe({
          next: ()=>{
            console.log("successfull")
          }
        })
    }
  

}

