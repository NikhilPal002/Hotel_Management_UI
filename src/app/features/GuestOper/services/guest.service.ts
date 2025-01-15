import { Injectable } from '@angular/core';
import { AddGuest } from '../models/add-guest.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Guest } from '../models/guest.model';
import { UpdateGuest } from '../models/update-guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  addGuest(model: AddGuest): Observable<void> {
      return this.http.post<void>(`${environment.apiBaseUrl}/api/Guest/add`,model);
  }

  getAllGuest(): Observable<Guest[]> {
      return this.http.get<Guest[]>(`${environment.apiBaseUrl}/api/Guest`);
  }

  getGuestById(id:number): Observable<Guest>{
    return this.http.get<Guest>(`${environment.apiBaseUrl}/api/Guest/${id}`)
  }

  updateGuest(id:number,updateGuest:UpdateGuest): Observable<Guest>{
    return this.http.put<Guest>(`${environment.apiBaseUrl}/api/Guest/update/${id}`,updateGuest)
  }

  deleteGuest(id:number): Observable<Guest>{
    return this.http.delete<Guest>(`${environment.apiBaseUrl}/api/Guest/delete/${id}`)
  }
}
