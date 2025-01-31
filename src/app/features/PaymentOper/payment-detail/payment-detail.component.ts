import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { PaymentDetails } from '../models/payment.model';

@Component({
  selector: 'app-payment-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent implements OnInit {
  billingId: number | null = null;
  paymentDetails: PaymentDetails | null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }


  ngOnInit(): void {
    this.billingId = Number(this.route.snapshot.paramMap.get('billingId'));

    if (this.billingId) {
      this.paymentService.getPaymentByBillingId(this.billingId).subscribe({
        next: (data) => {
          console.log('Payment Data:', data);
          this.paymentDetails = data;
          console.log(this.billingId);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load payment details';
        }
      });
    }
  }
}