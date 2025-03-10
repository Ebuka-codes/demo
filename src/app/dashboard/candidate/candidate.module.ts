import { NgModule } from '@angular/core';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { FormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CandidateViewComponent, CandidateComponent],
  imports: [FormsModule, CommonModule, NgbModule],
})
export class CandidateModule {}
