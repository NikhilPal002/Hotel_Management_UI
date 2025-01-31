import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BillingService } from '../services/billing.service';
import { Service } from '../models/service.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-billing',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  billingData = {
    bookingId: null,
    taxes: null
  };

  services: Service[] = [];
  selectedServices: Service[] = [];
  selectedServiceIds: number[] = [];
  generatedBill: any = null;
  errorMessage: string = '';

  @Output() billAdded = new EventEmitter<void>();

  constructor(private billingService: BillingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Fetch the services from the server
    this.billingService.getServices().subscribe(
      (services) => {
        this.services = services;
      },
      (error) => {
        this.errorMessage = 'Error fetching services.';
      }
    );
  }

  // Handle changes to the selected services
  onServiceSelection(): void {
    // Filter the selected services based on the selected IDs
    this.selectedServices = this.services.filter(service =>
      this.selectedServiceIds.includes(service.id)
    );
  }

  // Handle form submission to generate the bill
  generateBill(): void {
    if (!this.billingData.bookingId || !this.billingData.taxes || this.selectedServiceIds.length === 0) {
      this.errorMessage = 'Booking ID, taxes, and at least one service are required.';
      return;
    }

    // Pass the selected service IDs to the API
    this.billingService.generateBill(this.billingData, this.selectedServiceIds)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Bill Generated!',
            text: 'Bill has been successfully Generated.',
            timer: 2000,
            showConfirmButton: false
          });
          this.billAdded.emit();
          this.router.navigateByUrl('receptionist/billinglist')
        },
        error: (error) => {
          const errors = this.extractErrorMessages(error);

          Swal.fire({
            icon: 'error',
            title: 'Bill Generation Failed',
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
}
