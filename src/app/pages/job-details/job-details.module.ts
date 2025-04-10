import { NgModule } from '@angular/core';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CandidateLoginComponent } from '../candidate-login/candidate-login.component';
import { CommonModule } from '@angular/common';
import { JobDetailsRoutingModule } from './job-details-routing.module';

@NgModule({
  declarations: [
    JobOverviewComponent,
    JobApplicationComponent,
    CandidateLoginComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    CommonModule,
    JobDetailsRoutingModule,
  ],
})
export class JobDetailsModule {}
