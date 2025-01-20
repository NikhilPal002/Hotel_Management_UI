import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBooking } from '../models/create-booking.model';
import { environment } from '../../../../environments/environment';
import { Booking } from '../models/list-booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  addBooking(model: CreateBooking):Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Booking/create?AddAuth=true`, model);
  }
  
  getAllBooking():Observable<Booking[]>{
    return this.http.get<Booking[]>(`${environment.apiBaseUrl}/api/Booking?AddAuth=true`);
  }
  deletBooking(id:number):Observable<void>{
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/Booking/${id}?AddAuth=true`);
  }
  
}
