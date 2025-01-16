import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Inventory } from '../models/list-inventory.model';
import { Subscription } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { response } from 'express';
import { UpdateInventory } from '../models/update-inventory.model';

@Component({
  selector: 'app-update-inventory',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './update-inventory.component.html',
  styleUrl: './update-inventory.component.css'
})
export class UpdateInventoryComponent implements OnInit, OnDestroy {

  id: number | null = null;
  paramsSubscription?: Subscription;
  updateInventorySubscription?: Subscription;
  inventory?: Inventory;
  formattedLastUpdated: string = '';


  constructor(private route: ActivatedRoute,
    private router: Router, private inventoryService: InventoryService
  ) { }



  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        this.id = idParam ? parseInt(idParam, 10) : null;

        if (this.id) {
          this.inventoryService.getInventoryById(this.id)
            .subscribe({
              next: (response) => {
                this.inventory = response;

                // Format lastUpdated for datetime-local
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
    });
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


    if (this.id) {
      this.updateInventorySubscription = this.inventoryService.updateInventory(this.id, updateInventory)
        .subscribe({
          next: (response) => {
            alert('Inventory updated successfully.');
            this.router.navigateByUrl('/manager/inventory')
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Inventory not found or update failed!');
          }
        })
    }
  }



  onDelete(): void {
    if (this.id) {
      this.inventoryService.deleteInventory(this.id)
      .subscribe({
        next: (response) => {
          alert('Inventory deleted successfully.');
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
