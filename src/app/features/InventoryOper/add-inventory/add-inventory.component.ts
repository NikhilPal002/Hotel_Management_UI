import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AddInventory } from '../models/add-inventory.model';
import { Subscription } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-inventory',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.css'
})

export class AddInventoryComponent implements OnDestroy {

  @Output() inventoryAdded = new EventEmitter<void>();

  model: AddInventory;
  private AddInventorySubscription?: Subscription;

  constructor(private inventoryService: InventoryService,
    private router:Router
  ) {
    this.model = {
      inventoryName: '',
      quantity: 0,
      category: ''
    };
  }
  

  onFormSubmit(){
    this.AddInventorySubscription = this.inventoryService.addInventory(this.model)
    .subscribe({
      next:(response)=>{
        alert("Inventory Added successfully!");
        this.inventoryAdded.emit();
        this.router.navigateByUrl('/manager/inventory');
      },
      error: (error) => {
        alert('Inventory add failed!');
      }
    })
  }

  ngOnDestroy(): void {
    this.AddInventorySubscription?.unsubscribe();
  }

}
