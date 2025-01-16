import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddInventory } from '../models/add-inventory.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Inventory } from '../models/list-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  addInventory(model: AddInventory): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Inventory`, model);
  }

  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiBaseUrl}/api/Inventory`);
  } 
}
