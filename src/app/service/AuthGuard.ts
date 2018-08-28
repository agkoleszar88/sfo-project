import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../service/gapi-service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log ('entering can activate');
        if (sessionStorage.getItem(UserService.SESSION_STORAGE_KEY)) {
            console.log ('found token: ' + sessionStorage.getItem(UserService.SESSION_STORAGE_KEY));
            return true;
        }
console.log ('redirecting to login page');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
