import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AddStaff } from '../models/add-staff.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffService } from '../services/staff.service';
import { Router } from '@angular/router';

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
          alert("Staff added Successfully!");
          this.staffAdded.emit();
          this.router.navigateByUrl('/manager/staff');
        },
        error: (error) => {
          alert('Guest add failed!');
        }
      })
  }

  ngOnDestroy(): void {
    this.addStaffSubscription?.unsubscribe();
  }

}
