import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AddStaff } from '../models/add-staff.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffService } from '../services/staff.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent implements OnDestroy {

  @Output() staffAdded = new EventEmitter<void>();
  model: AddStaff;
  private addStaffSubscription?: Subscription;


  constructor(private staffService: StaffService,
    private router: Router
  ) {
    this.model = {
      fullName: '',
      email: '',
      age: 0,
      sAddress: '',
      salary: 0,
      designation: '',
      joinDate: new Date(),
      nIC: ''
    }
  }


  onFormSubmit() {
    this.addStaffSubscription = this.staffService.addStaff(this.model)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Staff Added!',
            text: 'Staff has been successfully added.',
            timer: 2000,
            showConfirmButton: false
          });
          this.staffAdded.emit();
          this.router.navigateByUrl('/manager/staff');
        },
        error: (error) => {
          const errors = this.extractErrorMessages(error);

          Swal.fire({
            icon: 'error',
            title: 'Staff Add Failed',
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
    this.addStaffSubscription?.unsubscribe();
  }

}
