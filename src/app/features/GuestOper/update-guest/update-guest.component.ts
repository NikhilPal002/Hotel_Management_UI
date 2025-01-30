import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GuestService } from '../services/guest.service';
import { Guest } from '../models/guest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateGuest } from '../models/update-guest.model';

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
            alert('Guest updated successfully!');
            this.closePopup.emit();
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Guest not found or update failed!');
          }
        })
    }
  }

  onDelete(): void {
    if (this.guestId) {
      this.guestService.deleteGuest(this.guestId)
        .subscribe({
          next: (response) => {
            alert('Guest deleted successfully!');
            this.closePopup.emit();
            this.router.navigateByUrl('/receptionist/guest')
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateGuestSubscription?.unsubscribe();
  }
}