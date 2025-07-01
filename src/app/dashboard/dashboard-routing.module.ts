import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CandidateComponent } from './candidate/candidate.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { RoleComponent } from './role/role.component';
import { UserCorporateComponent } from './user-corporate/user-corporate.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,

    children: [
      { path: 'dashboard', component: AdminDashboardComponent },

      { path: 'candidate', component: CandidateComponent },

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
      {
        path: 'corporate',
        loadChildren: () =>
          import('./corporate/corporate.module').then((m) => m.CorporateModule),
      },
      {
        path: 'job',
        loadChildren: () => import('./job/job.module').then((m) => m.JobModule),
      },

      {
        path: 'profile',

        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'users',
        component: UsersComponent,
      },

      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
