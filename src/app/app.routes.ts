import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

import { HomeComponent } from './Components/home/home.component';
import { GuestsComponent } from './features/GuestOper/guests/guests.component';
import { UpdateGuestComponent } from './features/GuestOper/update-guest/update-guest.component';
import { GuestListComponent } from './features/GuestOper/guest-list/guest-list.component';
import { AddRoomsComponent } from './features/RoomsOpr/add-rooms/add-rooms.component';


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
        path: 'manager/room/add',
        component: AddRoomsComponent
    }
];
