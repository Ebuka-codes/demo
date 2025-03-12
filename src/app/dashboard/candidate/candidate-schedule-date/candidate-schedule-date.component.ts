import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../shared/candidate.service';

@Component({
  selector: 'app-candidate-schedule-date',
  templateUrl: './candidate-schedule-date.component.html',
  styleUrls: ['./candidate-schedule-date.component.scss'],
})
export class CandidateScheduleDateComponent {
  scheduleDateForm!: FormGroup;
  submitted!: boolean;
  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService
  ) {
    this.scheduleDateForm = this.fb.group({
      scheduleDate: ['', Validators.required],
    });
  }
  get scheduleDate() {
    return this.scheduleDateForm.get('scheduleDate');
  }

  onSubmit() {
    this.submitted = true;
    if (this.scheduleDateForm.invalid) {
      return;
    }
  }
}
