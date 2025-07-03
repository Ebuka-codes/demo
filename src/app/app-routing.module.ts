import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { JobListingComponent } from './pages/job-listing/job-listing.component';
import { SessionExpirationComponent } from './pages/session-expiration/session-expiration.component';
import { AuthGuard } from './core/guard/auth-guard.service';
import { CandidateVerificationComponent } from './pages/candidate-verification/candidate-verification.component';
import { RecruiterMessageComponent } from './pages/recruiter-message/recruiter-message.component';
import { InterviewerValidationComponent } from './pages/interviewer-validation/interviewer-validation.component';
import { InterviewerFeedbackComponent } from './pages/interviewer-feedback/interviewer-feedback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'login',

    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },

  {
    path: 'job-listing/:corpUrl',
    component: JobListingComponent,
  },
  {
    path: 'session-expired',
    component: SessionExpirationComponent,
  },

  {
    path: 'candidate/action',
    component: CandidateVerificationComponent,
  },

  {
    path: 'recruiter-message/:token',
    component: RecruiterMessageComponent,
  },

  {
    path: 'interviewer/feedback/action',
    component: InterviewerValidationComponent,
  },
  {
    path: 'feedback-response/:token',
    component: InterviewerFeedbackComponent,
  },

  {
    path: 'apply',
    loadChildren: () =>
      import('./pages/job-details/job-details.module').then(
        (m) => m.JobDetailsModule
      ),
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
