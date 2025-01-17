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


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'receptionist/guest',
        component: GuestListComponent
    },
    {
        path: 'receptionist/guest/add',
        component: GuestsComponent
    },
    {
        path: 'receptionist/guest/update/:id',
        component: UpdateGuestComponent
    },
    {
        path: 'manager/room',
        component: ListRoomsComponent
    },
    {
        path: 'manager/room/add',
        component: AddRoomsComponent
    },
    {
        path: 'manager/room/update/:id',
        component: UpdateRoomsComponent
    },
    {
        path: 'manager/inventory/add',
        component: AddInventoryComponent
    },
    {
        path: 'manager/inventory',
        component: ListInventoryComponent
    },
    {
        path: 'manager/inventory/update/:id',
        component: UpdateInventoryComponent
    },
    {
        path: 'manager/staff',
        component: ListStaffComponent
    },
    {
        path: 'manager/staff/add',
        component: AddStaffComponent
    },
    {
        path: 'manager/staff/update/:id',
        component: UpdateStaffComponent
    },
];
