import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Billing } from '../models/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private apiUrl = `${environment.apiBaseUrl}/api/Billing`;

  constructor(private http: HttpClient) { }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/services?AddAuth=true`);
  }

  generateBill(billingData: any, serviceIds: number[]): Observable<any> {
    const serviceIdsParam = serviceIds.map(id => `serviceIds=${id}`).join('&');
    return this.http.post(`${this.apiUrl}/generate?${serviceIdsParam}&AddAuth=true`, billingData);
  }

  getBillingDetails(billingId: number): Observable<Billing> {
    return this.http.get<Billing>(`${this.apiUrl}/${billingId}?AddAuth=true`);
  }

  getAllBills(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?AddAuth=true`);
  }
}

// getGuestById(id:number): Observable<Guest>{
//     return this.http.get<Guest>(`${environment.apiBaseUrl}/api/Guest/${id}?AddAuth=true`)
//   }