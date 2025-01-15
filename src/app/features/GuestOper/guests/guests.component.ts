import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddGuest } from '../models/add-guest.model';
import { GuestService } from '../services/guest.service';
import { response } from 'express';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { error } from 'console';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css'
})
export class GuestsComponent implements OnDestroy {
  model: AddGuest;

  private addGuestSubscription?: Subscription;

  constructor(private guestService : GuestService) {
    this.model = {
      guestName: '',
      gender: '',
      email: '',
      phoneNumber: '',
      state: '',
      pinCode: ''
    };
  }
  

  onFormSubmit() {
    this.addGuestSubscription = this.guestService.addGuest(this.model)
    .subscribe({
      next: (response)=>{
        console.log("Successful")
      },
      error:(error)=>{
        console.log(error);
      }

    })
  }

  ngOnDestroy(): void {
    this.addGuestSubscription?.unsubscribe();
  }
}
