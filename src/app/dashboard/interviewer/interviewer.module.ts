import { NgModule } from '@angular/core';
import { InterviewerComponent } from './interviewer.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InterviewerComponent],
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class InterviewerModule {}
