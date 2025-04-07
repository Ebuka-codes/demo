import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { CandidateLoginComponent } from './pages/authentication/candidate-login/candidate-login.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { AuthGuard } from './authentication/shared/auth-guard.service';
import { JobListingComponent } from './pages/job-listing/job-listing.component';
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
    path: 'candidate/login',
    component: CandidateLoginComponent,
  },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent,
  },
  {
    path: 'job/apply/:id',
    component: ApplyComponent,
  },
  {
    path: 'job/apply',
    component: ApplyComponent,
  },
  {
    path: 'apply/:id',
    component: JobListingComponent,
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
