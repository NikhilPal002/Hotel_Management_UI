import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Staff } from '../models/list-staff.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StaffService } from '../services/staff.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateStaff } from '../models/update-staff.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-staff',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-staff.component.html',
  styleUrl: './update-staff.component.css'
})
export class UpdateStaffComponent implements OnInit, OnDestroy {

  paramsSubscription?: Subscription;
  updateStaffSubscription?: Subscription;
  staff?: Staff;

  @Input() staffId: number | null = null;
  @Output() closePopup = new EventEmitter<void>();


  constructor(private route: ActivatedRoute,
    private router: Router, private staffService: StaffService
  ) { }


  ngOnInit(): void {
    if (this.staffId) {
      this.paramsSubscription = this.staffService.getStaffById(this.staffId)
        .subscribe({
          next: (response) => {
            this.staff = response;
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Staff not found.',
              html: errors.join('<br>'),
            });
          },
        });
    }
  }

  onFormSubmit(): void {
    if (!this.staff) {
      Swal.fire({
        icon: 'error',
        text: 'Staff details not available',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const updateStaff: UpdateStaff = {
      fullName: this.staff?.fullName ?? '',
      email: this.staff?.email ?? '',
      age: this.staff?.age ?? 0,
      sAddress: this.staff?.sAddress ?? '',
      salary: this.staff?.salary ?? 0,
      designation: this.staff?.designation ?? '',
    }


    if (this.staffId) {
      this.updateStaffSubscription = this.staffService.updateStaff(this.staffId, updateStaff)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Staff Added!',
              text: 'Staff has been successfully updated.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
          },
          error: (error) => {
            const errors = this.extractErrorMessages(error);

            Swal.fire({
              icon: 'error',
              title: 'Staff update Failed',
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

  onDelete() {
    if (this.staffId) {
      this.staffService.deleteStaff(this.staffId)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Staff Deleted!',
              text: 'Staff has been successfully deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            this.closePopup.emit();
            this.router.navigateByUrl('/manager/staff')
          },
          error: (err) => {
            const errors = this.extractErrorMessages(err);

            Swal.fire({
              icon: 'error',
              title: 'Staff delete Failed',
              html: errors.join('<br>'),
            });
          }
        });
    }
  }


  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateStaffSubscription?.unsubscribe();
  }

}
