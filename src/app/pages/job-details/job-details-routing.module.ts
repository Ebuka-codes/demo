import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobLayoutComponent } from 'src/app/ui/job-layout/job-layout.component';
import { JobDetailsComponent } from './job-details.component';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobApplicationComponent } from './job-application/job-application.component';
const route: Routes = [
  {
    path: '',
    component: JobLayoutComponent,
    children: [
      {
        path: 'job-details/:id',
        component: JobDetailsComponent,
        children: [
          { path: '', component: JobOverviewComponent },
          { path: 'apply', component: JobApplicationComponent },
          { path: 'apply/:candidateId', component: JobApplicationComponent },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class JobDetailsRoutingModule {}
