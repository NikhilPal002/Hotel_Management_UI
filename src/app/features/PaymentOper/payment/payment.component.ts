import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { addpayment } from '../models/add-payment.model';
import { PaymentService } from '../services/payment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnDestroy {
  model: addpayment;
  private makePyamnetSubscription?:Subscription;

  constructor(private paymentService:PaymentService) {
    this.model = {
      paymentMethod: '',
      billingId: 0
    }
  }


  onFormSubmit():void{
   this.makePyamnetSubscription = this.paymentService.addPayment(this.model)
   .subscribe({
    next:()=>{
      alert("Payment successful");
    },
    error: (err) => {
      alert('Error making payment. Please try again.');
      console.error(err);
    }
   });
  }

  ngOnDestroy(): void {
    this.makePyamnetSubscription?.unsubscribe();
  }

}
