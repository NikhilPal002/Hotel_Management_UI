import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillingService } from '../services/billing.service';
import { Billing } from '../models/billing.model';
import { Service } from '../models/service.model';
import { Subscription } from 'rxjs';

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

  proceedToPayment() {
    if (this.billingId) {
      this.router.navigate([`/receptionist/payment/${this.billingId}`]);
    } else {
      console.error('Billing ID is not available.');
    }
  }

  viewPaymentDetail(): void {
    this.router.navigate(['/receptionist/payment-details/', this.bills?.id]);
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.billingSubscription?.unsubscribe();
  }
}
