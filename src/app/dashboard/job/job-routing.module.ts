import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobComponent } from './job.component';
import { JobFormComponent } from './components/job-form/job-form.component';

const routes: Routes = [
  {
    path: '',
    component: JobComponent,
  },
  {
    path: 'create',
    component: JobFormComponent,
  },
  {
    path: 'edit/:id',
    component: JobFormComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
