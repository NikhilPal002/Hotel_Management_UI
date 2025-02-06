import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Income, IncomeReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http:HttpClient) { }

  getStaffPaymentReport(startDate: Date, endDate: Date): Observable<any> {
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
   
    return this.http.get(`${environment.apiBaseUrl}/api/Reports/StaffPaymentReport?AddAuth=true`, {
      params: new HttpParams()
        .set('startDate', formattedStartDate)
        .set('endDate', formattedEndDate)
    });
  }
 
  getIncomeReport(report: IncomeReport): Observable<Income> {
    const formattedReport = {
      startdate: this.formatDate(report.startDate),
      enddate: this.formatDate(report.endDate),
    };
 
    return this.http.post<Income>(`${environment.apiBaseUrl}/api/Reports/IncomeReport?AddAuth=true`, formattedReport);
  }
 
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // ✅ Ensures only date part is sent
  }

    
}
