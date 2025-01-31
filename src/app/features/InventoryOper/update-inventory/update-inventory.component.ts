import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Inventory } from '../models/list-inventory.model';
import { Subscription } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { UpdateInventory } from '../models/update-inventory.model';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        text: 'No inventory data to update',
        timer: 2000,
        showConfirmButton: false
      });
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
            Swal.fire({
              icon: 'success',
              title: 'Inventory Updated!',
              text: 'Item has been successfully updated.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
          },
          error: (error) => {
            const errors = this.extractErrorMessages(error);

            Swal.fire({
              icon: 'error',
              title: 'Inventory Update Failed',
              html: errors.join('<br>'),
            });
          }
        })
    }
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }


  onDelete(): void {
    if (this.inventoryId) {
      this.inventoryService.deleteInventory(this.inventoryId)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Inventory Deleted!',
              text: 'Item has been successfully deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
            this.router.navigateByUrl('/manager/inventory');
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Item Delete Failed',
              html: errors.join('<br>'),
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateInventorySubscription?.unsubscribe();
  }

}
