import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/gapi-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
        if (token) {
            console.log ('adding token: '+ token);
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }

        if (!token)
        {
            console.log ('no token so cant add header');
        }

        return next.handle(request);
    }
}