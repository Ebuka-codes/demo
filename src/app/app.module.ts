import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderSpinnerComponent } from './ui/loader-spinner/loader-spinner.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { monthYearFormatDirective } from './shared/directives/month-date-format.directive';
import { JobComponent } from './pages/job/job.component';
import { CandidateLoginComponent } from './pages/authentication/candidate-login/candidate-login.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { FullPageLoaderSpinnerComponent } from './ui/full-page-loader-spinner/full-page-loader-spinner.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { CreatePasswordComponent } from './authentication/create-password/create-password.component';
import { AuthInterceptor } from './authentication/shared/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoaderSpinnerComponent,
    ApplyComponent,
    JobDetailsComponent,
    CandidateLoginComponent,
    monthYearFormatDirective,
    JobComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    FullPageLoaderSpinnerComponent,
    VerifyEmailComponent,
    CreatePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatStepperModule,
    MatSnackBarModule,
    MatIconModule,
    MatStepperModule,
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
