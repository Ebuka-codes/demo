import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobCreateComponent } from './job-create/job-create.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { JobComponent } from './job.component';

const routes: Routes = [
  {
    path: '',
    component: JobComponent,
  },
  {
    path: 'create',
    component: JobCreateComponent,
  },
  {
    path: 'edit/:id',
    component: JobEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
