import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/gapi-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const token = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
        if (token) {
            console.log ('adding token: ' + token);

            const _headers =  `
                Authorization: ""
            `;

            const oldHeaders = request.headers;

            let newHeaders: HttpHeaders = new HttpHeaders();

            const oldHeaderKeys: string [] = oldHeaders.keys();

            newHeaders = newHeaders.append('Authorization', 'Bearer ' + token);


            if (oldHeaderKeys != null && oldHeaderKeys.length > 0)
            {
                for (const key of oldHeaderKeys)
                {
                    newHeaders = newHeaders.append(key, oldHeaders.get(key) );
                }
            }

            request = request.clone ({
                headers: newHeaders
            });
        }

        if (!token) {
            console.log ('no token so cant add header');
        }

        return next.handle(request);
    }
}
