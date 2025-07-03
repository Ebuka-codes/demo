import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { JobListingComponent } from './pages/job-listing/job-listing.component';
import { CoreModule } from './core/core.module';
import { CandidateVerificationComponent } from './pages/candidate-verification/candidate-verification.component';
import { RecruiterMessageComponent } from './pages/recruiter-message/recruiter-message.component';
import { QuillModule } from 'ngx-quill';
import { InterviewerValidationComponent } from './pages/interviewer-validation/interviewer-validation.component';
import { InterviewerFeedbackComponent } from './pages/interviewer-feedback/interviewer-feedback.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { ToastComponent } from './shared/components/toast/toast.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SessionExpirationComponent } from './pages/session-expiration/session-expiration.component';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    JobDetailsComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    VerifyEmailComponent,
    JobListingComponent,
    RecruiterMessageComponent,
    InterviewerFeedbackComponent,
    InterviewerValidationComponent,
    CandidateVerificationComponent,
    ToastComponent,
    SessionExpirationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    QuillModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxPaginationModule,
    MatIconModule,
    LoadingBarHttpClientModule,
    DashboardModule,

    ToastrModule.forRoot({
      toastComponent: ToastComponent,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      timeOut: 5000,
      toastClass: 'custom-toast',
    }),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
