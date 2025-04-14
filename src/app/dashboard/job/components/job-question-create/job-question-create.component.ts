import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../shared/job.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { KeyValuePair } from '../../shared/job';
import { QuestionTypeOptions } from 'src/app/shared/type';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-job-question-create',
  templateUrl: './job-question-create.component.html',
  styleUrls: ['./job-question-create.component.scss'],
})
export class JobQuestionCreateComponent {
  @ViewChild('myQuestionModal') modalElement!: ElementRef;
  @Output() updateQuestion: EventEmitter<void> = new EventEmitter();
  @Input() editId!: any;
  @Input() isEditModal!: boolean;
  modalInstance!: Modal;
  questionForm!: FormGroup;
  questionTypeOptions: Array<QuestionTypeOptions> = [];
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  operatorData: any;
  isQualifyQuestion!: boolean;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editId']) {
      this.editId = this.editId;
      if (this.editId) {
        console.log(this.editId, 'me here');
        this.loadQuestionById(this.editId);
      }
    }
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
  onCreateQuestion(questionData: any) {
    this.jobService.createQuestion(questionData).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.questionTypeOptions = [];
          this.updateQuestion.emit();
          this.loaderService.setLoading(false);
          this.toastService.success('Created successfully!');
          this.closeModal();
        } else {
          this.closeModal();
          this.loaderService.setLoading(false);
          this.toastService.success(response.message);
        }
      },
      error: (error: any) => {
        this.questionTypeOptions = [];
        this.loaderService.setLoading(false);
        this.toastService.error('Error occur while creating question!');
        this.closeModal();
      },
    });
  }
  onEditQuestion(id: string, questionData: any) {
    this.jobService.editQuestion(id, questionData).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.questionTypeOptions = [];
          this.updateQuestion.emit();
          this.loaderService.setLoading(false);
          this.toastService.success(response.message);
          this.closeModal();
        } else {
          this.toastService.error(response.message);
          this.loaderService.setLoading(false);
          this.closeModal();
        }
      },
      error: (error: any) => {
        this.questionTypeOptions = [];
        this.loaderService.setLoading(false);
        this.toastService.error(error.message);
        this.closeModal();
      },
    });
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
      this.isQualifyQuestion = true;
    } else {
      this.isQualifyQuestion = false;
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
  loadQuestionById(id: string) {
    this.loaderService.setLoading(true);
    this.jobService.getQuestionById(id).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.questionForm.patchValue(response.data);
          // this.questionTypeOptions = response.data.options;
          console.log(response.data);
          this.questionForm.updateValueAndValidity();
          if (response.data.isQualifyQuestion === true) {
            this.isQualifyQuestion = true;
          }
          this.loaderService.setLoading(false);
        } else {
          this.loaderService.setLoading(true);
        }
      },
      error: (err) => {
        this.loaderService.setLoading(false);
      },
    });
  }
  onSubmitQuestion() {
    const questionData = {
      description: this.questionForm.get('description')?.value,
      questionType: this.questionForm.get('questionType')?.value,
      options: this.questionTypeOptions,
      operator: this.operator?.value === '' ? 'GREATER' : this.operator?.value,
      qualifyValue:
        this.qualifyValue?.value === '' ? '' : this.qualifyValue?.value,
      isQualifyQuestion:
        this.operator?.value && this.qualifyValue?.value ? true : false,
    };
    if (this.questionForm.valid) {
      this.isLoadingQuestion = true;
      this.loaderService.setLoading(true);
      if (!this.editId) {
        this.onCreateQuestion(questionData);
      } else {
        this.onEditQuestion(this.editId, questionData);
      }
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
    this.isLoadingQuestion = false;
  }
  resetQuestionForm() {
    this.questionForm.reset();
    this.questionTypeOptions = [];
    this.isSubmittedQuestion = false;
    this.isQualifyQuestion = false;
    this.isEditModal = false;
  }
}
