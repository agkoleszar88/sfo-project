import {Injectable, NgZone} from "@angular/core";
import * as _ from "lodash";
import {GoogleAuthService} from "ng-gapi/lib/GoogleAuthService";
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class UserService {
    public static readonly SESSION_STORAGE_KEY: string = "accessToken";
    private user: GoogleUser = undefined;

    constructor(private googleAuthService: GoogleAuthService,
                private ngZone: NgZone,       
                private route: ActivatedRoute,
                private router: Router) {
    }

    public setUser(user: GoogleUser): void {
        this.user = user;
    }

    public getCurrentUser(): GoogleUser {
        return this.user;
    }

    public getToken(): string {
        let token: string = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
        if (!token) {
            throw new Error("no token set , authentication required");
        }
        return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    }

    public signIn() {
        this.googleAuthService.getAuth().subscribe((auth) => {
           
            console.log ('got authorization');
            auth.signIn().then(res => this.signInSuccessHandler(res), err => this.signInErrorHandler(err));
        });
    }

    //TODO: Rework
    public signOut(): void {
        this.googleAuthService.getAuth().subscribe((auth) => {
            try {
                auth.signOut();
                sessionStorage.removeItem(UserService.SESSION_STORAGE_KEY);
            } catch (e) {
                console.error(e);
            }
        });
    }

    // check whether i'm signed in
    // added by agk

    public isUserSignedIn(): boolean {
        return !_.isEmpty(sessionStorage.getItem(UserService.SESSION_STORAGE_KEY));
    }

    private signInSuccessHandler(res: GoogleUser) {
        this.ngZone.run(() => {
            this.user = res;

            console.log ('setting token in session');
            sessionStorage.setItem(
                UserService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token);
                this.router.navigate(['/home']);


        });
    }

    private signInErrorHandler(err) {
        console.warn(err);
    }
}
