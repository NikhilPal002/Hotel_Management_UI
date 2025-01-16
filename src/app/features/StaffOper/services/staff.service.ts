import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddStaff } from '../models/add-staff.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  addStaff(model: AddStaff): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Staff`, model);
  }

}