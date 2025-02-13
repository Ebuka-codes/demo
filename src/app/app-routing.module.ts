import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewJobDetailsComponent } from './pages/view-job-details/view-job-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'job-details/:id',
    component: ViewJobDetailsComponent,
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
