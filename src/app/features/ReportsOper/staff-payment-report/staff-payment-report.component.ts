import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-payment-report',
  imports: [FormsModule, CommonModule],
  templateUrl: './staff-payment-report.component.html',
  styleUrl: './staff-payment-report.component.css'
})
export class StaffPaymentReportComponent {

  startDate: string = ''; // Initialize with an empty string for binding
  endDate: string = ''; // Initialize with an empty string for binding
  report: any;
  errorMessage?: string;

  constructor(private reportService: ReportsService) { }

  formatDateForDisplay(date: string): string {
    if (date) {
      const parsedDate = new Date(date);
      return parsedDate.toISOString().split('T')[0];
    }
    return '';
  }

  formatPaymentAmount(amount: number): string {
    return amount.toFixed(2);
  }

  fetchReport(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates.';
      Swal.fire({
        icon: 'warning',
        title: 'Missing Dates',
        text: this.errorMessage,
      });
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      this.errorMessage = 'Start date cannot be after the end date.';
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: this.errorMessage,
      });
      return;
    }

    this.reportService.getStaffPaymentReport(start, end).subscribe(
      (data) => {
        if (data && Object.keys(data).length > 0) {
          this.report = data;
          this.errorMessage = '';
          Swal.fire({
            icon: 'success',
            title: 'Report Fetched',
            text: 'Staff payment report has been successfully fetched!',
          });
        } else {
          this.report = null;
          this.errorMessage = 'No data available for the selected period.';
          Swal.fire({
            icon: 'info',
            title: 'No Data Found',
            text: this.errorMessage,
          });
        }
      },
      (error) => {
        this.report = null;
        this.errorMessage = error.error?.message || 'An error occurred while fetching the report.';
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Report',
          text: this.errorMessage,
        });
      }
    );
  }
}
