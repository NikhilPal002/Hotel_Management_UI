import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddRoom } from '../models/add-room.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Room } from '../models/room.model';
import { UpdateRoom } from '../models/update-room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient ) { }

  addRoom(model: AddRoom): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Room`,model);
  }

  getAllRoom(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiBaseUrl}/api/Room`);
  }
  getRoomById(id:number): Observable<Room> {
    return this.http.get<Room>(`${environment.apiBaseUrl}/api/Room/${id}`);
  }
  updateRoom(id:number,updateRoom:UpdateRoom): Observable<Room> {
    return this.http.put<Room>(`${environment.apiBaseUrl}/api/Room/${id}`,updateRoom);
  }
}
