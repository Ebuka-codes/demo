import { NgModule } from '@angular/core';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { FormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CandidateViewComponent, CandidateComponent],
  imports: [FormsModule, CommonModule],
})
export class CandidateModule {}
