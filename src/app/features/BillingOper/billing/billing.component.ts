import { Component, OnInit } from '@angular/core';
import { BillingService } from '../services/billing.service';
import { Service } from '../models/service.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
          alert("Bill Generated");
          this.router.navigateByUrl('receptionist/billinglist')
        },
        error: (error) => {
          this.errorMessage = 'Error generating bill.';
        }

      })
  }
}
