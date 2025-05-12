import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobDetailsComponent } from './job-details.component';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobApplicationComponent } from './job-application/job-application.component';
const route: Routes = [
  {
    path: ':id',
    component: JobDetailsComponent,
    children: [
      {
        path: 'overview/:corpUrl',
        component: JobOverviewComponent,
        pathMatch: 'full',
      },
      { path: 'application', component: JobApplicationComponent },
      {
        path: 'application/:candidateId',
        component: JobApplicationComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class JobDetailsRoutingModule {}
