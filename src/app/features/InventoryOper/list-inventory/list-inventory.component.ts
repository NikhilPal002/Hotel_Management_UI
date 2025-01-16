import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Inventory } from '../models/list-inventory.model';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-list-inventory',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './list-inventory.component.html',
  styleUrl: './list-inventory.component.css'
})
export class ListInventoryComponent implements OnInit {

  inventories$?:Observable<Inventory[]>

  constructor(private inventoryService: InventoryService){

  }
  ngOnInit(): void {
    this.inventories$ = this.inventoryService.getAllInventory();
  }


}
