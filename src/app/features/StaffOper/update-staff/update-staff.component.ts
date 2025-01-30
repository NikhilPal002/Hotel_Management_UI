import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Staff } from '../models/list-staff.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StaffService } from '../services/staff.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateStaff } from '../models/update-staff.model';

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

  @Input() staffId:number | null = null;
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
                alert('Staff not found.');
              },
            });
        }
      }

  onFormSubmit(): void {
    if(!this.staff) {
      alert("Staff details not available");
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


    if(this.staffId){
      this.updateStaffSubscription = this.staffService.updateStaff(this.staffId,updateStaff)
      .subscribe({
        next: (response) => {
          alert("Staff updated successfully");
          this.closePopup.emit();
        },
        error: (error) => {
          console.error('Update failed:', error);
          alert('Staff not found or update failed!');
        }
      })
    }

  }


  onDelete() {
    if (this.staffId) {
      this.staffService.deleteStaff(this.staffId)
      .subscribe({
        next:(response)=>{
          alert("Guest deleted successfully!");
          this.closePopup.emit();
          this.router.navigateByUrl('/manager/staff')
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.updateStaffSubscription?.unsubscribe();
  }

}
