import { Component } from '@angular/core'; // Import CKEditor build
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
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent {
  workmode: string[] = ['HYBRID', 'REMOTE', 'ON_SITE'];
  jobTypeOption: string[] = ['Full-time', 'Part-time', 'Contract'];
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
      questionOptions: this.fb.array([]),
      requiredSkills: [''],
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
  get questionOptions(): FormArray {
    return this.form.get('questionOptions') as FormArray;
  }
  get requiredskills() {
    return this.form.get('requiredSkills');
  }

  addQuestion() {
    this.questionOptions.push(this.fb.control(''));
  }
  removeQuestion(index: number) {
    this.questionOptions.removeAt(index);
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
      next: () => {
        this.loading = false;
        this.form.enable();
        let modalElement = document.getElementById(
          'addJobModal'
        ) as HTMLElement;
        if (modalElement) {
          const modalInstance =
            Modal?.getInstance(modalElement) || new Modal(modalElement);
          modalInstance.hide();
        }
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          document.body.classList.remove('modal-open');
        }, 300);
        this.form.reset();
        window.location.reload();
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
        requiredSkills:
          this.form.get('requiredSkills')?.value === ''
            ? []
            : this.form.get('requiredSkills')?.value,
        jobStatus: 'Pending',
      });
    } else {
      this.form.markAllAsTouched();
      console.log('error check if the input is valid');
    }
  }
  resetForm() {
    this.form.reset();
    this.isSubmitted = false;
    this.form.enable();
  }
}
