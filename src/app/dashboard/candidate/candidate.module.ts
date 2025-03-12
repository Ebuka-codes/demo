import { NgModule } from '@angular/core';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { CandidateScheduleDateComponent } from './candidate-schedule-date/candidate-schedule-date.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    CandidateViewComponent,
    CandidateComponent,
    CandidateScheduleDateComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class CandidateModule {}
