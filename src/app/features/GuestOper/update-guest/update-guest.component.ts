import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GuestService } from '../services/guest.service';
import { Guest } from '../models/guest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateGuest } from '../models/update-guest.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-guest',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-guest.component.html',
  styleUrl: './update-guest.component.css'
})
export class UpdateGuestComponent implements OnInit, OnDestroy {

  paramsSubscription?: Subscription;
  updateGuestSubscription?: Subscription;
  guest?: Guest;

  @Input() guestId: number | null = null;
  @Output() closePopup = new EventEmitter<void>();

  constructor(private route: ActivatedRoute,
    private guestService: GuestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.guestId) {  // Directly use the Input() guestId
      this.paramsSubscription = this.guestService.getGuestById(this.guestId)
        .subscribe({
          next: (response) => {
            this.guest = response;
          },
          error: () => {
            alert('Guest not found!');
          }
        });
    }
  }

  onFormSubmit(): void {
    if (!this.guest) return;

    const updateGuest: UpdateGuest = {
      guestName: this.guest?.guestName ?? '',
      gender: this.guest?.gender ?? '',
      email: this.guest?.email ?? '',
      phoneNumber: this.guest?.phoneNumber ?? '',
      state: this.guest?.state ?? '',
      pinCode: this.guest?.pinCode ?? '',
    }

    if (this.guestId) {
      this.updateGuestSubscription = this.guestService.updateGuest(this.guestId, updateGuest)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Guest Updated!',
              text: 'Guest has been successfully updated.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Guest update Failed',
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
    if (this.guestId) {
      this.guestService.deleteGuest(this.guestId)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Guest Deleted!',
              text: 'Guest has been successfully deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
            this.router.navigateByUrl('/receptionist/guest')
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Guest delete Failed',
              html: errors.join('<br>'),
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateGuestSubscription?.unsubscribe();
  }
}