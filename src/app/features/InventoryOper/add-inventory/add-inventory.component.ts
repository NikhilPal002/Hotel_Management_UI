import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AddInventory } from '../models/add-inventory.model';
import { Subscription } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.css'
})

export class AddInventoryComponent implements OnDestroy {

  @Output() inventoryAdded = new EventEmitter<void>();

  model: AddInventory;
  private AddInventorySubscription?: Subscription;

  constructor(private inventoryService: InventoryService,
    private router: Router
  ) {
    this.model = {
      inventoryName: '',
      quantity: 0,
      category: ''
    };
  }


  onFormSubmit() {
    this.AddInventorySubscription = this.inventoryService.addInventory(this.model)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Inventory Added!',
            text: 'Item has been successfully added.',
            timer: 2000,
            showConfirmButton: false
          });
          this.inventoryAdded.emit();
          this.router.navigateByUrl('/manager/inventory');
        },
        error: (error) => {
          const errors = this.extractErrorMessages(error);

          Swal.fire({
            icon: 'error',
            title: 'Item Add Failed',
            html: errors.join('<br>'),
          });
        }
      })
  }

  private extractErrorMessages(err: any): string[] {
    if (typeof err.error === 'string') return [err.error]; // Handle plain string error
    if (Array.isArray(err.error?.message)) return (err.error.message as string[]);
    if (err.error?.message) return [err.error.message as string];
    return Object.values(err.error?.errors || {}).flat() as string[] || ['An unexpected error occurred.'];
  }

  ngOnDestroy(): void {
    this.AddInventorySubscription?.unsubscribe();
  }

}
