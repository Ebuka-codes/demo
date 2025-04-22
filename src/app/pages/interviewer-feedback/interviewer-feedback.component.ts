import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { InterviewerService } from 'src/app/shared/service/interviewer.service';

@Component({
  selector: 'app-interviewer-feedback',
  templateUrl: './interviewer-feedback.component.html',
  styleUrls: ['./interviewer-feedback.component.scss'],
})
export class InterviewerFeedbackComponent {
  candidateInfo: any;
  data: any;
  selectedIndex: number = 0;
  selectedPerspective: any = null;
  feedbackForm: FormGroup;
  isValid: boolean = false;
  token: string | null;
  isLoading!: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private interviewerService: InterviewerService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    const feedbackData = sessionStorage.getItem('feedback-data');
    const candidateData = sessionStorage.getItem('candidate-data');
    if (!feedbackData || !candidateData) {
      this.router.navigate(['/']);
    } else {
      this.data = JSON.parse(feedbackData);
      this.candidateInfo = JSON.parse(candidateData);
    }

    const formGroups = this.data.perspectives.map((p: any) => {
      const itemGroups = p.items.map((item: any) =>
        this.fb.group({
          rating: ['', Validators.required],
          comment: ['', Validators.required],
          feedbackItemId: [item.id],
          ratingScaleId: [item.ratingScale.id],
        })
      );
      return this.fb.group({
        perspectiveId: [p.id],
        items: this.fb.array(itemGroups),
      });
    });

    this.feedbackForm = this.fb.group({
      perspectives: this.fb.array(formGroups),
    });

    this.token = this.route.snapshot.paramMap.get('token');
  }

  get perspectiveControls() {
    return (this.feedbackForm.get('perspectives') as FormArray).controls;
  }
  getCurrentGroup(): FormGroup {
    return this.perspectiveControls.at(this.selectedIndex) as FormGroup;
  }

  getCurrentItems(): FormArray {
    return this.getCurrentGroup().get('items') as FormArray;
  }

  getItemGroup(i: number): FormGroup {
    return this.getCurrentItems().at(i) as FormGroup;
  }
  onSelectPerspective(index: number) {
    this.selectedIndex = index;
    this.selectedPerspective = this.data.perspectives[index];
  }

  submitFeedback(data: any) {
    this.isLoading = true;
    this.interviewerService
      .sendFeeback(this.token, data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.toastService.success(response.message);
            this.feedbackForm.reset();
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
  onSubmit() {
    if (this.feedbackForm.valid) {
      const formValues = this.feedbackForm.value;
      const responses = formValues.perspectives.flatMap((perspective: any) =>
        perspective.items.map((item: any) => ({
          feedbackItemId: item.feedbackItemId,
          ratingScaleId: item.ratingScaleId,
          perspectiveId: perspective.perspectiveId,
          score: item.rating,
          comment: item.comment,
        }))
      );
      const data = {
        feedbackFormId: this.data.id,
        interviewId: this.candidateInfo.interviewerId,
        candidateId: this.candidateInfo.candidateId,
        jobId: '',
        responses,
      };
      this.isValid = false;
      this.submitFeedback(data);
    } else {
      this.feedbackForm.markAllAsTouched();
      this.isValid = true;
    }
  }
}
