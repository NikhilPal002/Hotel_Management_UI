import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

import { HomeComponent } from './Components/home/home.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'login',
        component: LoginComponent
    }
];
