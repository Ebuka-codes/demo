import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../shared/job.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { KeyValuePair } from '../shared/job';
import { QuestionTypeOptions } from 'src/app/shared/type';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-job-question-create',
  templateUrl: './job-question-create.component.html',
  styleUrls: ['./job-question-create.component.scss'],
})
export class JobQuestionCreateComponent {
  @ViewChild('myQuestionModal') modalElement!: ElementRef;
  @Output() updateQuestion: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  questionForm!: FormGroup;
  questionTypeOptions: Array<QuestionTypeOptions> = [];
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  operatorData: any;
  shortListing!: boolean;
  questionType = new Array<KeyValuePair>(
    { key: 'TEXT', value: 'Text' },
    { key: 'DROPDOWN', value: 'Dropdown' },
    { key: 'DATE', value: 'Date' }
  );
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {
    this.questionForm = this.fb.group({
      questionType: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array([]),
      optionsDescription: [''],
      operator: [''],
      qualifyValue: [''],
    });
  }
  ngOnInit() {
    this.getQuestionOperator();
    this.questionForm.get('operator')?.valueChanges.subscribe((value) => {
      if (value) {
        this.questionForm
          .get('qualifyValue')
          ?.setValidators([Validators.required]);
      } else {
        this.questionForm.get('qualifyValue')?.clearValidators();
      }
      this.questionForm.get('qualifyValue')?.updateValueAndValidity();
    });
  }

  get questionTypes() {
    return this.questionForm.get('questionType');
  }
  get description() {
    return this.questionForm.get('description');
  }
  get operator() {
    return this.questionForm.get('operator');
  }

  get qualifyValue() {
    return this.questionForm.get('qualifyValue');
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  resetQuestionForm() {
    this.questionForm.reset();
    this.questionTypeOptions = [];
    this.isSubmittedQuestion = false;
    this.shortListing = false;
  }
  addQuestionOption() {
    if (this.questionForm.get('optionsDescription')?.value) {
      this.questionTypeOptions.push({
        id: '',
        description: this.questionForm.get('optionsDescription')?.value,
      });
    }
    this.questionForm.get('optionsDescription')?.setValue('');
  }
  removeQuestionOption(index: number) {
    this.questionTypeOptions.splice(index, 1);
  }

  getQuestionOperator() {
    this.loaderService.setLoading(true);
    this.jobService.getOperator().subscribe({
      next: (response: any) => {
        this.operatorData = response.data;
        this.loaderService.setLoading(false);
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
      },
    });
  }
  onToggle(event: MatButtonToggleChange) {
    if (event.value === 'Yes') {
      this.shortListing = true;
    } else {
      this.shortListing = false;
      this.questionForm.get('operator')?.reset();
      this.questionForm.get('qualifyValue')?.reset();
    }
  }
  preventInvalidKey(event: KeyboardEvent) {
    if (
      event.key === '0' ||
      event.key === 'e' ||
      event.key === 'E' ||
      event.key === '+' ||
      event.key === '-'
    ) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  onSubmitQuestion() {
    const questionData = {
      description: this.questionForm.get('description')?.value,
      questionType: this.questionForm.get('questionType')?.value,
      options: this.questionTypeOptions,
      operator:
        this.operator?.value === '' || null ? 'GREATER' : this.operator?.value,
      qualifyValue:
        this.qualifyValue?.value === null ? '' : this.qualifyValue?.value,
      isQualifyQuestion:
        this.operator?.value && this.qualifyValue?.value ? true : false,
    };

    if (this.questionForm.valid) {
      this.isLoadingQuestion = true;
      this.loaderService.setLoading(true);
      this.jobService.createQuestion(questionData).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.isLoadingQuestion = false;
            this.questionTypeOptions = [];
            this.updateQuestion.emit();
            this.loaderService.setLoading(false);
            this.modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            backdrop?.remove();
            this.toastService.success('Created successfully!');
          }
        },
        error: (error: any) => {
          this.isLoadingQuestion = false;
          this.questionTypeOptions = [];
          this.loaderService.setLoading(false);
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.toastService.error('Error occur while creating question!');
        },
      });
    } else {
      this.isSubmittedQuestion = true;
    }
  }
}
