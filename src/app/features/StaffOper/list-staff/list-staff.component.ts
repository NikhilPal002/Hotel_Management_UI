import { Component, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Staff } from '../models/list-staff.model';
import { StaffService } from '../services/staff.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-staff',
  standalone:true,
  imports: [RouterModule, FormsModule,CommonModule],
  templateUrl: './list-staff.component.html',
  styleUrl: './list-staff.component.css'
})


export class ListStaffComponent implements OnInit {

  staff$?:Observable<Staff[]>;
  paginatedStaffs: Staff[] = [];
    currentPage: number = 1;
    pageSize: number = 5;
    totalPages: number = 0;
    pages: number[] = [];

  constructor(private staffService:StaffService){

  }

  ngOnInit(): void {
    this.staff$ = this.staffService.getAllStaff();
    this.staff$.subscribe((data) => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePaginatedStaffs(data);
    });
      
  }

  updatePaginatedStaffs(staffs: Staff[]): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedStaffs = staffs.slice(startIndex, endIndex);
    }
  
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.staff$?.subscribe((data) => this.updatePaginatedStaffs(data));
      }
    }


}
