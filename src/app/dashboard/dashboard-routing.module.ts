import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CandidateComponent } from './candidate/candidate.component';
import { JobComponent } from './job/job.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { UserCorporateComponent } from './user-corporate/user-corporate.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,

    children: [
      { path: 'dashboard', component: AdminDashboardComponent },

      { path: 'candidate', component: CandidateComponent },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'interviewer',
        component: InterviewerComponent,
      },
      {
        path: 'user/corporate',
        component: UserCorporateComponent,
      },

      {
        path: 'user/role',
        component: RoleComponent,
      },
      // Lazy-loaded routes
      {
        path: 'corporate',
        loadChildren: () =>
          import('./corporate/corporate.module').then((m) => m.CorporateModule),
      },
      {
        path: 'job',
        loadChildren: () => import('./job/job.module').then((m) => m.JobModule),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
