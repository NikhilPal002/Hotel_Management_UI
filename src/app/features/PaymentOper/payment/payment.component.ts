import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { Subscription } from 'rxjs';
import { BillingService } from '../../BillingOper/services/billing.service';
import { CommonModule } from '@angular/common';
import { Billing } from '../../BillingOper/models/billing.model';
import { Payment } from '../models/payment.model';
import Swal from 'sweetalert2';

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
              const errors = this.extractErrorMessages(error);

              Swal.fire({
                icon: 'error',
                title: 'Error fetching billing details:',
                html: errors.join('<br>'),
              });
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
      Swal.fire({
        icon: 'error',
        text: 'Invalid payment amount',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (!this.paymentMethod) {
      Swal.fire({
        icon: 'error',
        text: 'Payment method is required.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (this.billing?.paymentStatus === 'Paid') {
      Swal.fire({
        icon: 'error',
        text: 'Payment has already been made.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const paymentData: Payment = {
      ...this.payment,
      billingId: this.payment.billingId,
      paymentMethod: this.paymentMethod,
    };

    this.paymentService.processPayment(paymentData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Payment Processed!',
          text: 'Payment has been successfully Made.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/receptionist/view-bill', this.billingId]);
      },
      error: (error) => {
        const errors = this.extractErrorMessages(error);

        Swal.fire({
          icon: 'error',
          title: 'payment Failed',
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
    this.paymentSubscription?.unsubscribe();
  }
}