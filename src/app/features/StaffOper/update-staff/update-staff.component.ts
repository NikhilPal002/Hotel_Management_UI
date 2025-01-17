import { Component, OnDestroy, OnInit } from '@angular/core';
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

  id: number | null = null;
  ParamsSubscription?: Subscription;
  updateStaffSubscription?: Subscription;
  staff?: Staff;


  constructor(private route: ActivatedRoute,
    private router: Router, private staffService: StaffService
  ) { }


  ngOnInit(): void {
    this.ParamsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        this.id = idParam ? parseInt(idParam, 10) : null;

        if (this.id) {
          this.staffService.getStaffById(this.id)
            .subscribe({
              next: (response) => {
                this.staff = response;
              },
              error: (err) => {
                console.error('Failed to fetch room details:', err);
                alert('Room not found.');
              },
            });
        }
      }
    });

  }

  onFormSubmit(): void {
    const updateStaff: UpdateStaff = {

      fullName: this.staff?.fullName ?? '',
      email: this.staff?.email ?? '',
      age: this.staff?.age ?? 0,
      sAddress: this.staff?.sAddress ?? '',
      salary: this.staff?.salary ?? 0,
      designation: this.staff?.designation ?? '',
    }


    if(this.id){
      this.updateStaffSubscription = this.staffService.updateStaff(this.id,updateStaff)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/manager/staff')
        },
        error: (error) => {
          console.error('Update failed:', error);
          alert('Staff not found or update failed!');
        }
      })
    }

  }


  onDelete() {
    if (this.id) {
      this.staffService.deleteStaff(this.id)
      .subscribe({
        next:(response)=>{
          this.router.navigateByUrl('/manager/staff')
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.ParamsSubscription?.unsubscribe();
  }

}
