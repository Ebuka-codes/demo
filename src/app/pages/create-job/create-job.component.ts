import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JobRecruitService } from '../../shared/job-recruit.service';
import {
  DetailsType,
  jobType,
  KeyValuePair,
  QuestionTypeOptions,
} from '../../shared/type';
import { Notyf } from 'notyf';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;
  @ViewChild('newEmpType') newEmpType!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobTitle') newJobTitle!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobLocation') newJobLocation!: ElementRef<HTMLInputElement>;
  @ViewChild('newJobSkill') newJobSkill!: ElementRef<HTMLInputElement>;
  @ViewChild('myModal ') modalElement!: ElementRef;
  modalInstance!: Modal;

  workmode: string[] = ['HYBRID', 'REMOTE', 'ON_SITE'];
  selectedWorkmode: number | null = null;
  isSubmitted: boolean = false;
  isSubmittedQuestion: boolean = false;
  isLoadingQuestion: boolean = false;
  form: FormGroup;
  questionForm!: FormGroup;
  formatAmountValue: string = '';
  loading: boolean = false;
  froalaEditorInstance: any;
  questions: any;
  froalaOptions: any = {
    placeholderText: 'Enter content here...',
    events: {
      initialized: (editor: any) => {
        this.froalaEditorInstance = editor;
      },
    },
  };
  data: Array<DetailsType> = [];
  questionErrorMessage: string = '';
  jobTitleData: any[] = [];
  jobEmploymentData: any[] = [];
  jobLocationData: any[] = [];
  jobSkillData: any[] = [];
  typeValue: string = '';
  isLoading: boolean = false;
  private notyf = new Notyf();
  questionType = new Array<KeyValuePair>(
    { key: 'TEXT', value: 'Text' },
    { key: 'DROPDOWN', value: 'Dropdown' }
  );
  questionTypeOptions: Array<QuestionTypeOptions> = [];
  questionTypeDropdown: Array<QuestionTypeOptions> = [];
  selectedSkills: string[] = [];

  constructor(private fb: FormBuilder, private jobService: JobRecruitService) {
    this.form = this.fb.group({
      jobTitle: [
        '',
        [Validators.required, Validators.minLength(3), this.nameValidator()],
      ],
      jobLocation: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobSalary: ['', [Validators.required, this.amountValidator()]],
      jobStatus: [''],
      jobType: ['', Validators.required],
      companyName: ['', Validators.required],
      workMode: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionOptions: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });

    this.questionForm = this.fb.group({
      questionType: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array([]),
      optionsDescription: [''],
    });
  }

  ngOnInit(): void {
    if (this.froalaEditorInstance) {
      this.froalaEditorInstance.edit.off();
      this.froalaEditorInstance.$el.attr('contenteditable', 'false');
    }

    this.getJobDetailByType();
    this.getAllQuestion();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      document.body.style.overflow = 'auto';
    });
  }

  get jobTitle() {
    return this.form.get('jobTitle');
  }
  get jobDescription() {
    return this.form.get('jobDescription');
  }
  get employmentType() {
    return this.form.get('employmentType');
  }
  get jobLocation() {
    return this.form.get('jobLocation');
  }
  get jobSalary() {
    return this.form.get('jobSalary');
  }
  get jobType() {
    return this.form.get('jobType');
  }
  get companyName() {
    return this.form.get('companyName');
  }
  get workMode() {
    return this.form.get('workMode');
  }
  get questionTypes() {
    return this.questionForm.get('questionType');
  }
  get description() {
    return this.questionForm.get('description');
  }

  get requiredSkills() {
    return this.form.get('requiredSkills');
  }

  get jobStartDate() {
    return this.form.get('startDate');
  }
  get jobEndDate() {
    return this.form.get('endDate');
  }

  get questionOption() {
    return this.form.get('questionOptions');
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^[a-zA-Z\s]*$/.test(value);
      return valid ? null : { invalidName: { value: control.value } };
    };
  }
  amountValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (value == '') {
        return null;
      }
      const valid = /^\d+$/.test(value);
      return valid ? null : { invalidAmount: { value: control.value } };
    };
  }
  formatAmount(amount: Event) {
    const salary = amount.target as HTMLInputElement;
    if (amount) {
      this.formatAmountValue = salary.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      this.formatAmountValue = '';
    }
  }

  getAllQuestion() {
    this.isLoading = true;
    this.jobService.getAllQuestions().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.questionTypeDropdown = response.data;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notyf.error('Failed to get question options');
      },
    });
  }

  addQuestionOption() {
    this.questionTypeOptions.push({
      id: '',
      description: this.questionForm.get('optionsDescription')?.value,
    });
    this.questionForm.get('optionsDescription')?.setValue('');
  }
  removeQuestionOption(index: number) {
    this.questionTypeOptions.splice(index, 1);
  }
  getJobDetailByType() {
    this.isLoading = true;
    this.jobService.getQueryDetailsByType().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.data = response.data;
          this.jobTitleData = this.data.filter(
            (item) => item.type.trim() === 'jobTitle'
          );
          this.jobLocationData = this.data?.filter(
            (item) => item.type.trim() === 'jobLocation'
          );
          this.jobEmploymentData = this.data?.filter(
            (item) => item.type.trim() === 'employmentType'
          );
          this.jobSkillData = this.data?.filter(
            (item) => item.type.trim() === 'jobSkill'
          );

          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.log('error', error.message);
        this.isLoading = false;
      },
    });
  }

  selectSkill(skill: string | undefined) {
    if (skill) {
      if (!this.selectedSkills.includes(skill)) {
        this.selectedSkills.push(skill);
      }
    }
    this.updateInputValue();
  }
  updateInputValue() {
    this.selectedSkills = this.selectedSkills.filter(
      (skill) => skill !== undefined
    );
    if (this.selectedSkills.length > 0) {
      this.form
        .get('requiredSkills')
        ?.setValue(this.selectedSkills.join(', '), {
          emitEvent: false,
        });
    } else {
      this.form.get('requiredSkills')?.setValue('');
    }
  }

  createNewQueryDetails(data: DetailsType) {
    this.isLoading = true;
    this.jobService.createQueryDetails(data).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.getJobDetailByType();
          this.notyf.success({
            message: 'New query created successfully!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.isLoading = false;
      },
    });
  }

  openPanel() {
    setTimeout(() => {
      if (this.autoComplete) {
        this.autoComplete.openPanel();
      }
    }, 100);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.stopPropagation();
    }
  }

  addNewData(value: string, type: string) {
    if (value) {
      this.createNewQueryDetails({
        type: type,
        description: value,
      });
      this.newEmpType.nativeElement.value = '';
      this.newJobSkill.nativeElement.value = '';
      this.newJobTitle.nativeElement.value = '';
      this.newJobLocation.nativeElement.value = '';
      this.selectedSkills = [];
    }
  }
  createNewJob(newJob: jobType) {
    this.loading = true;
    this.form.disable();
    this.jobService.createJob(newJob).subscribe({
      next: (response) => {
        this.loading = false;
        this.form.enable();
        this.notyf.success({
          message: 'Job created successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.reset();
        this.isSubmitted = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.form.enable();
        this.form.reset();
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      },
    });
  }
  resetQuestionForm() {
    this.questionForm.reset();
    this.questionTypeOptions = [];
  }
  onSubmitQuestion() {
    if (this.questionForm.valid) {
      this.isLoadingQuestion = true;
      const questionData = {
        description: this.questionForm.get('description')?.value,
        questionType: this.questionForm.get('questionType')?.value,
        Options: this.questionTypeOptions,
      };

      this.jobService.createQuestion(questionData).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.notyf.success({
              message: 'New question created successfully!',
              duration: 4000,
              position: { x: 'right', y: 'top' },
            });
            this.isLoadingQuestion = false;
            this.modalInstance.hide();
            this.resetQuestionForm();
            this.questionTypeOptions = [];
            this.getAllQuestion();
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].parentNode?.removeChild(backdrops[0]);
            }
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
          this.modalInstance.hide();
          this.isLoadingQuestion = false;
          this.questionTypeOptions = [];
          const backdrops = document.getElementsByClassName('modal-backdrop');
          while (backdrops.length > 0) {
            backdrops[0].parentNode?.removeChild(backdrops[0]);
          }
          this.resetQuestionForm();
          document.body.style.overflow = 'auto';
        },
      });
    }
  }
  onSubmit(): void {
    this.isSubmitted = true;
    const startDateValue = this.form.get('startDate')?.value;
    const endDateValue = this.form.get('endDate')?.value;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (this.form.valid && this.questionTypeOptions) {
      this.createNewJob({
        ...this.form.value,
        startDate: `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${startDate
          .getDate()
          .toString()
          .padStart(2, '0')}`,

        endDate: `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`,

        jobStatus: 'Pending',
        requiredSkills: this.selectedSkills,
        employmentType: this.form.get('employmentType')?.value.toUpperCase(),
        jobSalary: Number(this.form.get('jobSalary')?.value),
      });
    } else {
      console.log('error check if the input is valid');
      this.questionErrorMessage = 'Please fill the required question';
    }
  }
}
