import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GuestService } from '../services/guest.service';
import { Guest } from '../models/guest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateGuest } from '../models/update-guest.model';
import { response } from 'express';

@Component({
  selector: 'app-update-guest',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-guest.component.html',
  styleUrl: './update-guest.component.css'
})
export class UpdateGuestComponent implements OnInit, OnDestroy {

  id: number | null = null;
  paramsSubscription?: Subscription;
  updateGuestSubscription?: Subscription;
  guest?: Guest;


  constructor(private route: ActivatedRoute,
    private guestService: GuestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        this.id = idParam ? parseInt(idParam, 10) : null;

        if (this.id) {
          this.guestService.getGuestById(this.id)
            .subscribe({
              next: (response) => {
                this.guest = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    const updateGuest: UpdateGuest = {
      guestName: this.guest?.guestName ?? '',
      gender: this.guest?.gender ?? '',
      email: this.guest?.email ?? '',
      phoneNumber: this.guest?.phoneNumber ?? '',
      state: this.guest?.state ?? '',
      pinCode: this.guest?.pinCode ?? '',
    }

    if (this.id) {
      this.updateGuestSubscription = this.guestService.updateGuest(this.id, updateGuest)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/receptionist/guest')
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
      this.guestService.deleteGuest(this.id)
      .subscribe({
        next:(response)=>{
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
