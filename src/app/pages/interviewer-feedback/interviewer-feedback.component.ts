import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { InterviewerService } from 'src/app/shared/service/interviewer.service';

@Component({
  selector: 'erecruit-interviewer-feedback',
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
  otherFormInfo!: FormGroup;
  isOtherFormInfo: boolean = true;
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
      observation: ['', Validators.required],
    });

    this.otherFormInfo = this.fb.group({
      currentAnnualSalary: [
        '',
        [Validators.required, Validators.pattern('^[0-9 ]*$')],
      ],
      expectedAnnualSalary: [
        '',
        [Validators.required, Validators.pattern('^[0-9 ]*$')],
      ],
      availability: ['', [Validators.required]],
      recommendation: ['', [Validators.required]],
      candidateType: ['', Validators.required],
      alternativePosition: ['', [Validators.required]],
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
  get observation() {
    return this.feedbackForm.get('observation');
  }

  get currentAnnualSalary() {
    return this.otherFormInfo.get('currentAnnualSalary')!;
  }

  get expectedAnnualSalary() {
    return this.otherFormInfo.get('expectedAnnualSalary')!;
  }

  get availability() {
    return this.otherFormInfo.get('availability')!;
  }

  get recommendation() {
    return this.otherFormInfo.get('recommendation')!;
  }

  get candidateType() {
    return this.otherFormInfo.get('candidateType')!;
  }

  get alternativePosition() {
    return this.otherFormInfo.get('alternativePosition')!;
  }
  onSelectPerspective(index: number) {
    this.selectedIndex = index;
    this.selectedPerspective = this.data.perspectives[index];
  }

  submitFeedback(data: any) {
    this.isLoading = true;

    // this.interviewerService
    //   .sendFeeback(this.token, data)
    //   .pipe(finalize(() => (this.isLoading = false)))
    //   .subscribe({
    //     next: (response: any) => {
    //       if (response.valid) {
    //         this.toastService.success(response.message);
    //         this.feedbackForm.reset();
    //       } else {
    //         this.toastService.error(response.message);
    //       }
    //     },
    //     error: (error) => {
    //       this.toastService.error(error.message);
    //     },
    //   });
  }
  onSubmit() {
    const OtherFormInfo = {
      currentAnnualSalary: Number(this.otherFormInfo.value.currentAnnualSalary),
      expectedAnnualSalary: Number(
        this.otherFormInfo.value.expectedAnnualSalary
      ),
      availability: this.otherFormInfo.value.availability,
      recommendation: this.otherFormInfo.value.recommendation,
      candidateType: this.otherFormInfo.value.candidateType,
      alternativePosition: this.otherFormInfo.value.alternativePosition,
    };

    if (this.feedbackForm.valid && this.otherFormInfo.valid) {
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
        OtherFormInfo: OtherFormInfo,
      };
      this.isValid = false;
      this.submitFeedback(data);
    } else {
      this.feedbackForm.markAllAsTouched();
      this.otherFormInfo.markAllAsTouched();
      this.isValid = true;
    }
  }

  showOtherForm() {
    this.isOtherFormInfo = true;
  }
  onNavigateBack() {
    this.isOtherFormInfo = false;
  }
}
