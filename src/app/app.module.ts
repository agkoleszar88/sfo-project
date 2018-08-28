import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxEditorModule } from 'ngx-editor';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import { PerformActionDialog } from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login';
import { routing } from './app.routing';
import { AuthGuard } from '../app/service/AuthGuard';
import { ErrorInterceptor } from '../app/helpers/error.intercepter';



import {
  
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { UserService } from './service/gapi-service';
import {
  GoogleApiModule, 
  NgGapiClientConfig, 
  NG_GAPI_CONFIG,
} from "ng-gapi";
import { BloggerService } from './service/BloggerService';
import { AlertService } from './service/alert.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AlertComponent } from './directives/alert.component';


  let gapiClientConfig: NgGapiClientConfig = {
    client_id: "980468360399-4461jk5letcrkalphrbaef75bm7eohsu.apps.googleusercontent.com",
    discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
    scope: [
        "https://www.googleapis.com/auth/blogger"
    ].join(" ")
};



@NgModule({

  entryComponents: [AppComponent, PerformActionDialog],
  declarations: [
    AppComponent, HomeComponent, AlertComponent, LoginComponent,PerformActionDialog
  ],
  imports: [
    BrowserModule,
    routing,
    NgbModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxEditorModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
  ],
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
  ],
 

  providers: [ AuthGuard,
    AlertService,
    UserService,
    BloggerService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true} ,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],  
bootstrap: [AppComponent],

})
export class AppModule { }

