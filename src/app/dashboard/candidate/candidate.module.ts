import { NgModule } from '@angular/core';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CandidateScheduleDateComponent } from './candidate-schedule-date/candidate-schedule-date.component';
import { MatInputModule } from '@angular/material/input';
import { CandidateRejectComponent } from './candidate-reject/candidate-reject.component';
import { CandidateFilterComponent } from './candidate-filter/candidate-filter.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmptyDataComponent } from '../components/ui/empty-data/empty-data.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    CandidateViewComponent,
    CandidateComponent,
    CandidateScheduleDateComponent,
    CandidateRejectComponent,
    CandidateFilterComponent,
    EmptyDataComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
  ],
})
export class CandidateModule {}
