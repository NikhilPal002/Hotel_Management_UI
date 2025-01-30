import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Staff } from '../models/list-staff.model';
import { StaffService } from '../services/staff.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddStaffComponent } from '../add-staff/add-staff.component';
import { UpdateStaffComponent } from '../update-staff/update-staff.component';

declare var bootstrap: any;

@Component({
  selector: 'app-list-staff',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, AddStaffComponent, UpdateStaffComponent],
  templateUrl: './list-staff.component.html',
  styleUrl: './list-staff.component.css'
})


export class ListStaffComponent implements OnInit {

  staff$?: Observable<Staff[]>;
  paginatedStaffs: Staff[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pages: number[] = [];

  selectedStaffId: number | null = null;

  @ViewChild('addStaffModal', { static: false }) addStaffModal!: ElementRef;

  constructor(private staffService: StaffService) {

  }

  ngOnInit(): void {
    this.loadStaffs();

  }

  loadStaffs(): void {
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

  closeModal() {
    let modalElement = document.getElementById('addStaffModal')
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      this.loadStaffs();
    }
  }

  openEditStaffModal(staffId: number): void {
    this.selectedStaffId = staffId;
    setTimeout(() => {
      let modalElement = document.getElementById('editStaffModal');
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
    let modalElement = document.getElementById('editStaffModal');
    if (modalElement) {

      document.body.focus();

      let modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      // Refresh the guest list after closing the edit modal
      this.loadStaffs();

      // Reset selected guest to allow loading a new one
      this.selectedStaffId = null;
    }
  }

}
