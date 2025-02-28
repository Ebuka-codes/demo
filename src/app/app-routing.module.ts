import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { ApplyComponent } from './components/apply/apply.component';
import { CreateJobComponent } from './pages/create-job/create-job.component';
import { CorporateComponent } from './pages/corporate/corporate.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'job/apply',
    component: ApplyComponent,
  },
  {
    path: 'create-job/:SHL',
    component: CreateJobComponent,
  },
  {
    path: 'create/corporate',
    component: CorporateComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
