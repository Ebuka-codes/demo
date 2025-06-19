import { NgModule } from '@angular/core';
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
import { JobFilterModalComponent } from './components/job-filter-modal/job-filter-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobQuestionModalComponent } from './components/job-question-modal/job-question-modal.component';
import { JobViewModalComponent } from './components/job-view-modal/job-view-modal.component';
import { JobDeleteModalComponent } from './components/job-delete-modal/job-delete-modal.component';

@NgModule({
  declarations: [
    JobComponent,
    JobQuestionModalComponent,
    JobViewModalComponent,
    JobFilterModalComponent,
    JobFormComponent,
    JobViewModalComponent,
    JobDeleteModalComponent,
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
