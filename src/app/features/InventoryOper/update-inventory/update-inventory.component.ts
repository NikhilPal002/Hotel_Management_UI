import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Inventory } from '../models/list-inventory.model';
import { Subscription } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { UpdateInventory } from '../models/update-inventory.model';

@Component({
  selector: 'app-update-inventory',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-inventory.component.html',
  styleUrl: './update-inventory.component.css'
})
export class UpdateInventoryComponent implements OnInit, OnDestroy {

  paramsSubscription?: Subscription;
  updateInventorySubscription?: Subscription;
  inventory?: Inventory;
  formattedLastUpdated: string = '';

  @Input() inventoryId: number | null = null;
  @Output() closePopup = new EventEmitter<void>();


  constructor(private route: ActivatedRoute,
    private router: Router, private inventoryService: InventoryService
  ) { }



  ngOnInit(): void {

    if (this.inventoryId) {
      this.paramsSubscription = this.inventoryService.getInventoryById(this.inventoryId)
        .subscribe({
          next: (response) => {
            this.inventory = response;
            if (this.inventory.lastUpdated) {
              const date = new Date(this.inventory.lastUpdated);
              this.formattedLastUpdated = date.toISOString().slice(0, 16);
            }
          },
          error: (err) => {
            console.error('Failed to fetch inventory details:', err);
            alert('Inventory not found.');
          },
        });
    }
  }


  onFormSubmit(): void {

    if (!this.inventory) {
      alert('No inventory data to update.');
      return;
    }

    const updateInventory: UpdateInventory = {
      inventoryName: this.inventory?.inventoryName ?? '',
      quantity: this.inventory?.quantity ?? 0,
      category: this.inventory?.category ?? '',

    }


    if (this.inventoryId) {
      this.updateInventorySubscription = this.inventoryService.updateInventory(this.inventoryId, updateInventory)
        .subscribe({
          next: (response) => {
            alert('Inventory updated successfully.');
            this.closePopup.emit();
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Inventory not found or update failed!');
          }
        })
    }
  }



  onDelete(): void {
    if (this.inventoryId) {
      this.inventoryService.deleteInventory(this.inventoryId)
        .subscribe({
          next: (response) => {
            alert('Inventory deleted successfully.');
            this.closePopup.emit();
            this.router.navigateByUrl('/manager/inventory');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateInventorySubscription?.unsubscribe();
  }

}
