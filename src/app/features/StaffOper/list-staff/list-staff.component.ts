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

  constructor(private staffService:StaffService){

  }

  ngOnInit(): void {
    this.staff$ = this.staffService.getAllStaff();
      
  }


}
