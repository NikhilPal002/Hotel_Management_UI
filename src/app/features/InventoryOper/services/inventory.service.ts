import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddInventory } from '../models/add-inventory.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Inventory } from '../models/list-inventory.model';
import { UpdateInventory } from '../models/update-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  addInventory(model: AddInventory): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/Inventory?AddAuth=true`, model);
  }

  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${environment.apiBaseUrl}/api/Inventory?AddAuth=true?AddAuth=true`);
  } 

  getInventoryById(id:number): Observable<Inventory> {
    return this.http.get<Inventory>(`${environment.apiBaseUrl}/api/Inventory/${id}?AddAuth=true`);
  } 

  updateInventory(id:number, updateInventory:UpdateInventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${environment.apiBaseUrl}/api/Inventory/${id}?AddAuth=true`, updateInventory);
  }

  deleteInventory(id:number): Observable<Inventory> {
    return this.http.delete<Inventory>(`${environment.apiBaseUrl}/api/Inventory/${id}?AddAuth=true`);
  }

}
