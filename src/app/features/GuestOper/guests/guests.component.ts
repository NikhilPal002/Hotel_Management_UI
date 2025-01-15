import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddGuest } from '../models/add-guest.model';
import { GuestService } from '../services/guest.service';
import { response} from 'express';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


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

  constructor(private guestService : GuestService,
    private router: Router) {
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
        this.router.navigateByUrl('/receptionist/guest');
      },
    })
  }

  ngOnDestroy(): void {
    this.addGuestSubscription?.unsubscribe();
  }
}
