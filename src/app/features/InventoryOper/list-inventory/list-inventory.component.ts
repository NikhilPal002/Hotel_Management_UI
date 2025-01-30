import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Inventory } from '../models/list-inventory.model';
import { InventoryService } from '../services/inventory.service';
import { AddInventoryComponent } from '../add-inventory/add-inventory.component';
import { UpdateInventoryComponent } from '../update-inventory/update-inventory.component';

declare var bootstrap: any;

@Component({
  selector: 'app-list-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AddInventoryComponent, UpdateInventoryComponent],
  templateUrl: './list-inventory.component.html',
  styleUrl: './list-inventory.component.css'
})
export class ListInventoryComponent implements OnInit {

  inventories$?: Observable<Inventory[]>
  paginatedInventories: Inventory[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  selectedInventoryId: number | null = null;

  @ViewChild('addInventoryModal', { static: false }) addInventoryModal!: ElementRef;
  

  constructor(private inventoryService: InventoryService) {

  }

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
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

  closeModal() {
    let modalElement = document.getElementById('addInventoryModal')
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.loadInventory();
    }
  }

  openEditInventoryModal(inventoryId: number): void {
    this.selectedInventoryId = inventoryId;

    setTimeout(() => {
      let modalElement = document.getElementById('editInventoryModal');
      if (modalElement) {
        let modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Move focus to the modal
        modalElement.setAttribute('tabindex', '-1');
        modalElement.focus();
      }
    }, 100);
  }

  closeEditModal(): void {
    let modalElement = document.getElementById('editInventoryModal');
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      // Refresh the guest list after closing the edit modal
      this.loadInventory();

      // Reset selected guest to allow loading a new one
      this.selectedInventoryId = null;
    }
  }

}

