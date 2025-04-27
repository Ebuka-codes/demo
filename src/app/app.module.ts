import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderSpinnerComponent } from './ui/loader-spinner/loader-spinner.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { FullPageLoaderSpinnerComponent } from './ui/full-page-loader-spinner/full-page-loader-spinner.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { FooterComponent } from './ui/footer/footer.component';
import { AppLayoutComponent } from './ui/app-layout/app-layout.component';
import { JobLayoutComponent } from './ui/job-layout/job-layout.component';
import { HeaderComponent } from './ui/header/header.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoaderSpinnerComponent,
    JobDetailsComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    FullPageLoaderSpinnerComponent,
    VerifyEmailComponent,
    FooterComponent,
    AppLayoutComponent,
    JobLayoutComponent,
    HeaderComponent,
    LoaderSpinnerComponent,
    JobListingComponent,
    CandidateVerificationComponent,
    RecruiterMessageComponent,
    InterviewerValidationComponent,
    InterviewerFeedbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    QuillModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
