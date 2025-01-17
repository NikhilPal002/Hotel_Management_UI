import { Component, OnDestroy } from '@angular/core';
import { AddStaff } from '../models/add-staff.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffService } from '../services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-staff',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent implements OnDestroy{

  model: AddStaff;
  private addStaffSubscription?: Subscription;


  constructor(private staffService: StaffService,
    private router:Router
  ){
    this.model = {
      fullName:'',
      email:'',
      age:0,
      sAddress:'',
      salary:'',
      designation:'',
      joinDate: new Date(),
      nIC:''
    }
  }


  onFormSubmit(){
    this.addStaffSubscription  = this.staffService.addStaff(this.model)
    .subscribe({
      next:(response)=>{
        this.router.navigateByUrl('/manager/staff');
      }
    })
  }

  ngOnDestroy(): void {
    this.addStaffSubscription?.unsubscribe();
  }

}
