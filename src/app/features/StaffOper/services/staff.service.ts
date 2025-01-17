import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddStaff } from '../models/add-staff.model';
import { environment } from '../../../../environments/environment';
import { Staff } from '../models/list-staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  addStaff(model: AddStaff): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Staff`, model);
  }

  getAllStaff():Observable<Staff[]>{
    return this.http.get<Staff[]>(`${environment.apiBaseUrl}/api/Staff`);
  }

}