import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  processPayment(model: Payment): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Payment?AddAuth=true`, model);
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${environment.apiBaseUrl}/api/Payment?AddAuth=true`);
  }

  getPaymentByBillingId(billingId: number): Observable<Payment> {
    return this.http.get<Payment>(`${environment.apiBaseUrl}/api/Payment/billing/${billingId}?AddAuth=true`);
  }

}
