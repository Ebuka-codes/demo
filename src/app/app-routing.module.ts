import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { ApplyComponent } from './pages/apply/apply.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth/login',
    component: LoginComponent,
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
    component: HomeComponent,
  },

  {
    path: '',
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
