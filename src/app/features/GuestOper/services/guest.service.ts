import { Injectable } from '@angular/core';
import { AddGuest } from '../models/add-guest.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Guest } from '../models/guest.model';
import { UpdateGuest } from '../models/update-guest.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient,
    private cookieService:CookieService
  ) { }

  
  getAllGuest(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${environment.apiBaseUrl}/api/Guest?AddAuth=true`);
  }

  
  getGuestById(id:number): Observable<Guest>{
    return this.http.get<Guest>(`${environment.apiBaseUrl}/api/Guest/${id}?AddAuth=true`)
  }

  addGuest(model: AddGuest): Observable<void> {
      return this.http.post<void>(`${environment.apiBaseUrl}/api/Guest/add?AddAuth=true`,model);
  }

  updateGuest(id:number,updateGuest:UpdateGuest): Observable<Guest>{
    return this.http.put<Guest>(`${environment.apiBaseUrl}/api/Guest/update/${id}?AddAuth=true`,updateGuest
    )}

  deleteGuest(id:number): Observable<Guest>{
    return this.http.delete<Guest>(`${environment.apiBaseUrl}/api/Guest/delete/${id}?AddAuth=true`)
  }
}
