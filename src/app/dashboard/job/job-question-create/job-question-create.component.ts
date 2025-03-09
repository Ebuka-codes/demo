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
import { Notyf } from 'notyf';
import { KeyValuePair } from '../shared/job';
import { QuestionTypeOptions } from 'src/app/shared/type';
import { DashboardService } from '../../dashboard.service';

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
  notyf = new Notyf();
  isLoadingQuestion: boolean = false;
  questionType = new Array<KeyValuePair>(
    { key: 'TEXT', value: 'Text' },
    { key: 'DROPDOWN', value: 'Dropdown' },
    { key: 'DATE', value: 'Date' }
  );
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private dashboardService: DashboardService
  ) {
    this.questionForm = this.fb.group({
      questionType: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array([]),
      optionsDescription: [''],
    });
  }
  ngOnInit(): void {}

  get questionTypes() {
    return this.questionForm.get('questionType');
  }
  get description() {
    return this.questionForm.get('description');
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  resetQuestionForm() {
    this.questionForm.reset();
    this.questionTypeOptions = [];
    this.isSubmittedQuestion = false;
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
  onSubmitQuestion() {
    if (this.questionForm.valid) {
      this.isLoadingQuestion = true;
      this.questionForm.disable();
      const questionData = {
        description: this.questionForm.get('description')?.value,
        questionType: this.questionForm.get('questionType')?.value,
        options: this.questionTypeOptions,
      };
      this.dashboardService.setLoading(true);
      this.jobService.createQuestion(questionData).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.notyf.success({
              message: 'Created successfully!',
              duration: 4000,
              position: { x: 'right', y: 'top' },
            });
            this.isLoadingQuestion = false;
            this.questionTypeOptions = [];
            this.updateQuestion.emit();
            this.dashboardService.setLoading(false);
            this.modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            backdrop?.remove();
            this.questionForm.enable();
          }
        },
        error: (error: any) => {
          this.notyf.error({
            message: 'Error occur!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
          this.isLoadingQuestion = false;
          this.questionTypeOptions = [];
          this.dashboardService.setLoading(false);
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.questionForm.enable();
        },
      });
    } else {
      this.isSubmittedQuestion = true;
    }
  }
}
