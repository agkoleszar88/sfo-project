import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from '../service/gapi-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authenticationService: UserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                console.log ('got 401 authorization error');
                sessionStorage.removeItem(UserService.SESSION_STORAGE_KEY);
                this.router.navigate(['/login']);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
