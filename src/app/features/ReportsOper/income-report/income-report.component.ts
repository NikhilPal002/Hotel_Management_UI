import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReportsService } from '../services/reports.service';
import { Income, IncomeReport } from '../models/report.model';

@Component({
  selector: 'app-income-report',
  imports: [FormsModule, CommonModule],
  templateUrl: './income-report.component.html',
  styleUrl: './income-report.component.css'
})

export class IncomeReportComponent {


  report: IncomeReport = {
    startDate: new Date(), // Set default to today
    endDate: new Date(),   // Set default to today
  };
  incomeReport: Income | undefined;
  errorMessage: string = '';

  constructor(private reportService: ReportsService) { }

  fetchReport() {
    // Ensure start and end dates are in correct order
    if (this.report.startDate >= this.report.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: 'Start date must be before the end date.',
      });
      return;
    }

    this.reportService.getIncomeReport(this.report).subscribe(
      (data) => {
        console.log(data);
        if (data && Object.keys(data).length) {
          this.incomeReport = {
            startDate: new Date(data.startDate),  // Assuming response uses "startdate"
            endDate: new Date(data.endDate),      // Assuming response uses "enddate"
            totalIncome: data.totalIncome,
            noOfBookings: data.noOfBookings,
          };
          Swal.fire({
            icon: 'success',
            title: 'Report Fetched',
            text: 'Income report has been successfully fetched!',
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No Data Found',
            text: 'No income data is available for the selected period.',
          });
        }
      },
      (error) => {
        let errorMessage = 'An unexpected error occurred.';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error; // Handle string error message
        } else if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.message || JSON.stringify(error.error); // Extract a message or stringify the object
        }
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Report',
          text: error.error || 'An unexpected error occurred.',
        });
      }
    );
  }

  onStartDateChange(event: any) {
    this.report.startDate = new Date(event.target.value);
  }

  onEndDateChange(event: any) {
    this.report.endDate = new Date(event.target.value);
  }

  formatDateForDisplay(date: any): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
