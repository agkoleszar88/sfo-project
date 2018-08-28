import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './service/AuthGuard';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
