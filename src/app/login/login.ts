import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService } from '../service/alert.service';
import { UserService } from '../service/gapi-service';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: UserService,
        private alertService: AlertService) {}

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    doLogin() {
        this.submitted = true;
        this.loading = true;
        console.log ('performing login');
        this.authenticationService.signIn();
    }
}
