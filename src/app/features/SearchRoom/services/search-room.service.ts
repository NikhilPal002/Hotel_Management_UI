import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Room } from '../models/searchRoom.model';

@Injectable({
  providedIn: 'root'
})
export class SearchRoomService {

  private apiUrl = `${environment.apiBaseUrl}/api/SearchRoom?AddAuth=true`;  // Change the URL to your API

  constructor(private http: HttpClient) {}

  searchRooms(criteria: any): Observable<any> {
    let params = new HttpParams();

    // Ensure the query parameters are in the correct format
    if (criteria.numberOfBeds) {
      params = params.set('numberOfBeds', criteria.numberOfBeds.toString());
    }
    if (criteria.checkInDate) {
      params = params.set('checkInDate', criteria.checkInDate);
    }
    if (criteria.checkOutDate) {
      params = params.set('checkOutDate', criteria.checkOutDate);
    }

    // Return the API response as an observable
    return this.http.get<any>(this.apiUrl, { params });
  }
}

