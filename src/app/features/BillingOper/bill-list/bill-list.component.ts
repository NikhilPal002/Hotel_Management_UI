import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Billing } from '../models/billing.model';
import { BillingService } from '../services/billing.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css'] 
})
export class BillListComponent implements OnInit, OnDestroy {
  billings$: Observable<Billing[]> | undefined;
  billings: Billing[] = [];
  paginatedBills: Billing[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];
  subscription?: Subscription; 

  constructor(
    private billingService: BillingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.billings$ = this.billingService.getAllBills();
    this.subscription = this.billings$.subscribe((data: Billing[]) => {
      if (data && data.length > 0) {
        this.billings = data;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePaginatedBills();
      }
    });
  }

  // Updates the paginated list of bills
  updatePaginatedBills(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBills = this.billings.slice(startIndex, endIndex);
  }

  // Handles page changes
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedBills();
    }
  }

  // ✅ Method to navigate to View Bill with correct billingId
  viewBill(billingId: number): void {
    if (billingId) {
      this.router.navigate(['/receptionist/view-bill', billingId]); // Ensures correct navigation
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // ✅ Prevents memory leaks
  }
}
