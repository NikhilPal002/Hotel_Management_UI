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
  paginatedInventories: Inventory[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private inventoryService: InventoryService){

  }

  ngOnInit(): void {
    this.inventories$ = this.inventoryService.getAllInventory();
    this.inventories$.subscribe((data) => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedInventories(data);
    });
  }

  updatePaginatedInventories(inventories: Inventory[]): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInventories = inventories.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.inventories$?.subscribe((data) => this.updatePaginatedInventories(data));
    }
  }
}

