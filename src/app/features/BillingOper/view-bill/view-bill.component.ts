import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillingService } from '../services/billing.service';
import { Billing } from '../models/billing.model';
import { Service } from '../models/service.model';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../PaymentOper/services/payment.service';

@Component({
  selector: 'app-view-bill',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.css'
})
export class ViewBillComponent implements OnInit, OnDestroy {
  bills?: Billing;
  billingId: number | null = null;
  paramsSubscription?: Subscription;
  billingSubscription?: Subscription;
  services: Service[] = [];

  constructor(
    private route: ActivatedRoute,
    private billingService: BillingService,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      const idParam = params.get('billingId');
      this.billingId = idParam ? parseInt(idParam, 10) : null;

      if (this.billingId !== null) {
        this.billingSubscription = this.billingService.getBillingDetails(this.billingId)
          .subscribe({
            next: (response) => {
              this.bills = response;
              this.services = response.services || []
            },
            error: (error) => {
              console.error('Error fetching billing details:', error);
            }
          });
      }
    });
  }

   // Function to handle payment processing
   proceedToPayment(): void {
    if (!this.bills) return;

    alert(`Proceeding to payment for Billing ID: ${this.bills.billingId}`);

    // ✅ Redirect to payment gateway or update the API to mark as paid
    this.paymentService.updatePaymentStatus(this.bills.billingId, 'Completed').subscribe({
      next: () => {
        alert('Payment Successful!');
        this.bills!.paymentStatus = 'Completed'; // Update UI instantly
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        alert('Payment failed. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.billingSubscription?.unsubscribe();
  }
}
