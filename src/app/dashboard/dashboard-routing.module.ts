import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CandidateComponent } from './candidate/candidate.component';
import { JobComponent } from './job/job.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,

    children: [
      { path: '', component: AdminDashboardComponent },

      { path: 'candidate', component: CandidateComponent },

      {
        path: 'job',
        component: JobComponent,
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
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
