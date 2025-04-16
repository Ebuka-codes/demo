import { NgModule } from '@angular/core';
import { CandidateViewComponent } from './components/candidate-view/candidate-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CandidateScheduleDateComponent } from './components/candidate-schedule-date/candidate-schedule-date.component';
import { MatInputModule } from '@angular/material/input';
import { CandidateRejectComponent } from './components/candidate-reject-modal/candidate-reject.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CandidateFilterModalComponent } from './components/candidate-filter-modal/candidate-filter-modal.component';
import { CandidateSearchModalComponent } from './components/candidate-search-modal/candidate-search-modal.component';
import { MatSliderModule } from '@angular/material/slider';
import { SharedModule } from 'src/app/shared/shared.module';
import { CandidateMailModalComponent } from './components/candidate-mail-modal/candidate-mail-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    CandidateViewComponent,
    CandidateComponent,
    CandidateScheduleDateComponent,
    CandidateRejectComponent,
    CandidateFilterModalComponent,
    CandidateSearchModalComponent,
    CandidateMailModalComponent,
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
    MatSliderModule,
    SharedModule,
    MatTooltipModule,
  ],
})
export class CandidateModule {}
