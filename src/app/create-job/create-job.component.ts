import { Component } from '@angular/core'; // Import CKEditor build
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JobRecruitService } from '../shared/job-recruit.service';
import { jobType } from '../shared/type';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent {
  workmode: string[] = ['Remote', 'On-Site', 'Hybrid'];
  jobTypeOption: string[] = [
    'Engineering',
    'Marketing',
    'Sales',
    'Healthcare',
    ' IT Support',
  ];
  employmentOption: string[] = ['PERMANENT', 'TEMPORARY'];
  selectedWorkmode: number | null = null;
  isSubmitted: boolean = false;
  form: FormGroup;
  formatAmountValue: string = '';
  loading: boolean = false;
  froalaEditorInstance: any;
  options = [
    { value: 'option1', viewValue: 'Option 1' },
    { value: 'option2', viewValue: 'Option 2' },
    { value: 'option3', viewValue: 'Option 3' },
    { value: 'option1', viewValue: 'Option 1' },
  ];
  froalaOptions: any = {
    placeholderText: 'Enter content here...',
    events: {
      initialized: (editor: any) => {
        this.froalaEditorInstance = editor;
      },
    },
  };
  constructor(private fb: FormBuilder, private jobService: JobRecruitService) {
    this.form = this.fb.group({
      jobTitle: [
        '',
        [Validators.required, Validators.minLength(3), this.nameValidator()],
      ],
      jobDescription: ['', Validators.required],
      jobLocation: ['', Validators.required],
      employmentType: ['', Validators.required],
      jobSalary: ['', [Validators.required, this.amountValidator()]],
      jobStatus: [''],
      jobType: ['', Validators.required],
      companyName: ['', Validators.required],
      workMode: ['', Validators.required],
      questions: this.fb.array([]),
      requiredskills: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.froalaEditorInstance) {
      this.froalaEditorInstance.edit.off();
      this.froalaEditorInstance.$el.attr('contenteditable', 'false');
    }
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
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }
  get requiredskills() {
    return this.form.get('requiredskills');
  }

  addQuestion() {
    this.questions.push(this.fb.control(''));
  }
  removeQuestion(index: number) {
    this.questions.removeAt(index);
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
  createNewJob(newJob: jobType) {
    this.loading = true;
    this.form.disable();
    this.jobService.createJob(newJob).subscribe({
      next: (response) => {
        console.log('data received', response.data);
        this.loading = false;
        this.form.enable();
      },
      error: (error: any) => {
        console.log('error', error.message);
        this.loading = false;
        this.form.enable();
      },
    });
  }
  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.createNewJob({
        ...this.form.value,
        jobSalary: Number(this.form.get('jobSalary')?.value),
        jobStatus: 'Pending',
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  resetForm() {
    this.form.reset();
    this.isSubmitted = false;
    this.form.enable();
  }
}
