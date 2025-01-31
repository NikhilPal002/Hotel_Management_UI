import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

import { HomeComponent } from './Components/home/home.component';
import { GuestsComponent } from './features/GuestOper/guests/guests.component';
import { UpdateGuestComponent } from './features/GuestOper/update-guest/update-guest.component';
import { GuestListComponent } from './features/GuestOper/guest-list/guest-list.component';
import { AddRoomsComponent } from './features/RoomsOpr/add-rooms/add-rooms.component';
import { ListRoomsComponent } from './features/RoomsOpr/list-rooms/list-rooms.component';
import { UpdateRoomsComponent } from './features/RoomsOpr/update-rooms/update-rooms.component';
import { AddInventoryComponent } from './features/InventoryOper/add-inventory/add-inventory.component';
import { ListInventoryComponent } from './features/InventoryOper/list-inventory/list-inventory.component';
import { UpdateInventoryComponent } from './features/InventoryOper/update-inventory/update-inventory.component';
import { AddStaffComponent } from './features/StaffOper/add-staff/add-staff.component';
import { ListStaffComponent } from './features/StaffOper/list-staff/list-staff.component';
import { UpdateStaffComponent } from './features/StaffOper/update-staff/update-staff.component';
import { CreateBookingComponent } from './features/BookingOper/create-booking/create-booking.component';
import { ListBookingComponent } from './features/BookingOper/list-booking/list-booking.component';
import { PaymentComponent } from './features/PaymentOper/payment/payment.component';
import { authGuard } from './features/login/guards/auth.guard';
import { SearchRoomComponent } from './features/SearchRoom/search-room/search-room.component';
import { BillingComponent } from './features/BillingOper/billing/billing.component';
import { BillListComponent } from './features/BillingOper/bill-list/bill-list.component';
import { ViewBillComponent } from './features/BillingOper/view-bill/view-bill.component';
import { PaymentDetailComponent } from './features/PaymentOper/payment-detail/payment-detail.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'receptionist/guest',
        component: GuestListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/guest/add',
        component: GuestsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/guest/update/:id',
        component: UpdateGuestComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/room',
        component: ListRoomsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/room/add',
        component: AddRoomsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/room/update/:id',
        component: UpdateRoomsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/inventory/add',
        component: AddInventoryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/inventory',
        component: ListInventoryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/inventory/update/:id',
        component: UpdateInventoryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/staff',
        component: ListStaffComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/staff/add',
        component: AddStaffComponent,
        canActivate: [authGuard]
    },
    {
        path: 'manager/staff/update/:id',
        component: UpdateStaffComponent,
        canActivate: [authGuard]
    },

    {
        path: 'receptionist/booking/add',
        component: CreateBookingComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/booking',
        component: ListBookingComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/payment/:billingId',
        component: PaymentComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/payment-details/:billingId',
        component: PaymentDetailComponent,
        canActivate: [authGuard]
    },

    {
        path: 'receptionist/search',
        component: SearchRoomComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/billing',
        component: BillingComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/billinglist',
        component: BillListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'receptionist/view-bill/:billingId',
        component: ViewBillComponent,
        canActivate: [authGuard]
    },

];
