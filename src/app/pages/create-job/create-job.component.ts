import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JobRecruitService } from '../../shared/job-recruit.service';
import { jobType } from '../../shared/type';
import { Notyf } from 'notyf';
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent implements OnInit {
  workmode: string[] = ['HYBRID', 'REMOTE', 'ON_SITE'];
  jobTypeOption: string[] = ['Full-time', 'Part-time', 'Contract'];
  employmentOption: string[] = ['PERMANENT', 'TEMPORARY'];
  selectedWorkmode: number | null = null;
  isSubmitted: boolean = false;
  form: FormGroup;
  formatAmountValue: string = '';
  loading: boolean = false;
  froalaEditorInstance: any;
  questions: any;
  skillsOptions = [
    { value: 'Angular', viewValue: 'Angular' },
    { value: 'Java', viewValue: 'Java' },
    { value: 'Databasse', viewValue: 'Database' },
  ];
  froalaOptions: any = {
    placeholderText: 'Enter content here...',
    events: {
      initialized: (editor: any) => {
        this.froalaEditorInstance = editor;
      },
    },
  };
  private notyf = new Notyf();
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
      questionOptions: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.froalaEditorInstance) {
      this.froalaEditorInstance.edit.off();
      this.froalaEditorInstance.$el.attr('contenteditable', 'false');
    }
    this.getAllQuestion();
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
  get questionOptions(): FormArray {
    return this.form.get('questionOptions') as FormArray;
  }
  get requiredskills(): FormArray {
    return this.form.get('requiredSkills') as FormArray;
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
    this.jobService.getQuestionOption().subscribe({
      next: (response: any) => {
        if (response.valid && response?.data) {
          this.questions = response.data;
        }
      },
      error: (error: any) => {
        console.log('error', error.message);
      },
    });
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
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.createNewJob({
        ...this.form.value,
        jobSalary: Number(this.form.get('jobSalary')?.value),
        requiredSkills:
          this.form.get('requiredSkills')?.value === ''
            ? []
            : this.form.get('requiredSkills')?.value,
        jobStatus: 'Pending',
      });
    } else {
      console.log('error check if the input is valid');
    }
  }
}
