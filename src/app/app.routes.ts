import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

import { HomeComponent } from './Components/home/home.component';
import { GuestsComponent } from './features/GuestOper/guests/guests.component';
import { UpdateGuestComponent } from './features/GuestOper/update-guest/update-guest.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'receptionist/add-guest',
        component: GuestsComponent
    },
    {
        path: 'receptionist/update-guest',
        component: UpdateGuestComponent
    }
];
