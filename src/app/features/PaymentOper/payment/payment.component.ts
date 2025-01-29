import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { Subscription } from 'rxjs';
import { BillingService } from '../../BillingOper/services/billing.service';
import { CommonModule } from '@angular/common';
import { Billing } from '../../BillingOper/models/billing.model';
import { Payment } from '../models/payment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, OnDestroy {
  billingId: number | null = null;
  billing?: Billing;
  paymentMethod: string | undefined;
  paymentStatus?: string;
  paymentSubscription?: Subscription;
  payment: Payment = {
    paymentId: 0,
    paymentAmount: 0,
    paymentMethod: '',
    transactionId: '',
    paymentDate: new Date(),
    billingId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private billingService: BillingService,
    private router: Router,
    private paymentService: PaymentService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('billingId');
      this.billingId = idParam ? parseInt(idParam, 10) : null;

      if (this.billingId !== null) {

        this.billingService.getBillingDetails(this.billingId)
          .subscribe({
            next: (response) => {
              this.billing = response;
              this.payment.billingId = this.billing.billingId
              this.payment.paymentAmount = this.billing.totalCost;
            },
            error: (error) => {
              console.error('Error fetching billing details:', error);
            }
          });
      }
      else {
        console.error('Billing ID not found');
      }
    });
  }


  makePayment(): void {
    if (this.payment.paymentAmount <= 0) {
      console.error('Invalid payment amount');
      return;
    }

    if (!this.paymentMethod) {
      console.error('Payment method is required.');
      return;
    }

    if (this.billing?.paymentStatus === 'Paid') {
      alert('Payment has already been processed.');
      return;
    }

    const paymentData: Payment = {
      ...this.payment,
      billingId: this.payment.billingId,
      paymentMethod: this.paymentMethod,
    };
    
    this.paymentService.processPayment(paymentData).subscribe({
      next: (response) => {
        alert("Payment processed succesfully")
        this.router.navigate(['/receptionist/view-bill', this.billingId]);  
      },
      error: (error) => {
        console.error('Error processing payment:', error);
      }
    });

  }

  ngOnDestroy(): void {
    this.paymentSubscription?.unsubscribe();
  }
}