import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddGuest } from '../models/add-guest.model';
import { GuestService } from '../services/guest.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css'
})
export class GuestsComponent implements OnDestroy {
  @Output() guestAdded = new EventEmitter<void>();
  model: AddGuest;

  private addGuestSubscription?: Subscription;

  constructor(private guestService: GuestService, private router: Router) {
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
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Guest Added!',
            text: 'Guest has been successfully added.',
            timer: 2000,
            showConfirmButton: false
          });
          this.guestAdded.emit();
          this.router.navigateByUrl('/receptionist/guest');
        },
        error: (err) => {
          const errors = this.extractErrorMessages(err);

          Swal.fire({
            icon: 'error',
            title: 'Guest Add Failed',
            html: errors.join('<br>'),
          });
        }
      });
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }

  ngOnDestroy(): void {
    this.addGuestSubscription?.unsubscribe();
  }
}

