import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBooking } from '../models/create-booking.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  addBooking(model: CreateBooking):Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Booking/create`, model);
  }
  
}
