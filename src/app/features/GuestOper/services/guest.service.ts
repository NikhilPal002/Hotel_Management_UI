import { Injectable } from '@angular/core';
import { AddGuest } from '../models/add-guest-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  addGuest(model: AddGuest): Observable<void> {
      return this.http.post<void>(`${environment.apiBaseUrl}/api/Guest/add`,model);
  }
}
