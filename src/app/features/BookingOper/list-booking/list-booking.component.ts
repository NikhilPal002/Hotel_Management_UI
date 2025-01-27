import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from '../models/list-booking.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-list-booking',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list-booking.component.html',
  styleUrl: './list-booking.component.css'
})
export class ListBookingComponent implements OnInit {

  booking$?: Observable<Booking[]>;
  id: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private bookingService: BookingService,
    private router: Router
  ) {
    const newBooking: Booking = {
      bookingId: 0,
      numberOfAdults: 0,
      numberOfChildren: 0,
      checkIn: new Date(),
      checkOut: new Date(),
      numberOfNights: 0,
      totalCost: 0,
      bookingStatus: '',
      paymentStatus: '',
      guest: {
        guestId: 0,
        guestName: '',
        gender: '',
        email: '',
        phoneNumber: '',
        state: '',
        pinCode: ''
      },
      room: {
        roomId: 0,
        roomType: '',
        description: '',
        numberOfBeds: 0,
        pricePerNight: 0,
        status: ''
      }
    };

  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBooking().subscribe((bookings) => {
      const totalItems = bookings.length;
      this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.booking$ = new Observable((observer) => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        observer.next(bookings.slice(start, end));
        observer.complete();
      });
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }


  onDelete(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.deletBooking(id).subscribe({
        next: (response) => {
          alert('Booking has been successfully cancelled');
          this.booking$ = this.bookingService.getAllBooking();
        },
        error: (err) => {
          alert('Error cancelling booking. Please try again.');
          console.error(err);
        }
      });
    }
  }
}
