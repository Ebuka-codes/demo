import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CorporateComponent } from './corporate/corporate.component';
import { CandidateComponent } from './candidate/candidate.component';
import { CreateJobComponent } from './create-job/create-job.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,

    children: [
      {
        path: 'corporate',
        component: CorporateComponent,
      },
      { path: 'candidate/:id', component: CandidateComponent },

      { path: 'create-job/:id', component: CreateJobComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
