import { Component, OnDestroy } from '@angular/core';
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
        console.log("Inventory added successfully")
      }
    })
  }

  ngOnDestroy(): void {
    this.AddInventorySubscription?.unsubscribe();
  }

}
