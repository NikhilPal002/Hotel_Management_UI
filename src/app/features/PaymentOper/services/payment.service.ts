import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addpayment } from '../models/add-payment.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { }

  addPayment(model: addpayment) : Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Payment`,model);
  }
}
