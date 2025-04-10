import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { AuthGuard } from './authentication/shared/auth-guard.service';
import { JobListingComponent } from './pages/job-listing/job-listing.component';
import { SessionComponent } from './dashboard/components/ui/session/session.component';

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
    path: 'apply/:corpId',
    component: JobListingComponent,
  },
  {
    path: 'session',
    component: SessionComponent,
  },
  {
    path: 'job',
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
