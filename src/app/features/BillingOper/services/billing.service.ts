import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  getBillingDetails(billingId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${billingId}?AddAuth=true`);
  }
}
