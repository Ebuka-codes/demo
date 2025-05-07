import { NgModule } from '@angular/core';
import { JobCreateComponent } from './job-create/job-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { JobQuestionCreateComponent } from './components/job-question-create/job-question-create.component';
import { JobViewComponent } from './job-view/job-view.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { JobDeleteComponent } from './job-delete/job-delete.component';
import { JobFilterComponent } from './job-filter/job-filter.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    JobCreateComponent,
    JobComponent,
    JobQuestionCreateComponent,
    JobViewComponent,
    JobEditComponent,
    JobDeleteComponent,
    JobFilterComponent,
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    QuillModule.forRoot(),
    NgbModule,
    CommonModule,
    JobRoutingModule,
    FormsModule,
    MatButtonToggleModule,
    NgbTooltipModule,
    SharedModule,
  ],
})
export class JobModule {}
