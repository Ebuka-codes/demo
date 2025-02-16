import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Modal } from 'bootstrap';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { jobType } from 'src/app/shared/type';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent {
  @ViewChild('resumeInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper!: MatStepper;
  personalFormGroup!: FormGroup;
  questionsFormGroup!: FormGroup;
  experienceFormGroup!: FormGroup;
  supportingFormGroup!: FormGroup;
  isSubmitting: boolean = false;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  isLoading: boolean = false;
  data?: jobType;
  id: string | null = '';
  workHistories: any[] = [];
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(private fb: FormBuilder, private _jobService: JobRecruitService) {
    this.personalFormGroup = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, this.ValidateEmail()]],
        phone: ['', [Validators.required, this.validatePhone()]],
        countryName: ['', Validators.required],
        state: ['', Validators.required],
        homeAddress: ['', Validators.required],
        postalCode: ['', Validators.required],
        linkedinProfile: [''],
      },
      { Validators: this.requireOneFieldValidator }
    );

    this.questionsFormGroup = this.fb.group({
      question1: ['', Validators.required],
    });
    this.experienceFormGroup = this.fb.group({
      employerName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      jobFunction: [''],
      Degree: ['', Validators.required],
      Major: [''],
      school: ['', Validators.required],
      schoolStartDate: [''],
      schoolEndDate: [''],
      educationLevel: [''],
      skills: this.fb.array([], [Validators.required]),
    });
    this.supportingFormGroup = this.fb.group({
      resumeFile: [null],
      coverLetter: [''],
    });
  }
  ngOnInit(): void {
    this.id = this._jobService.getJobDetailId();
    this._jobService.getJobDetailsById(this.id).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.data = response.data;
          console.log(this.data);
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  get firstName() {
    return this.personalFormGroup.get('firstName');
  }
  get lastName() {
    return this.personalFormGroup.get('lastName');
  }
  get email() {
    return this.personalFormGroup.get('email');
  }
  get phone() {
    return this.personalFormGroup.get('phone');
  }
  get countryName() {
    return this.personalFormGroup.get('countryName');
  }
  get state() {
    return this.personalFormGroup.get('state');
  }
  get homeAddress() {
    return this.personalFormGroup.get('homeAddress');
  }
  get postalCode() {
    return this.personalFormGroup.get('resume');
  }
  get skills() {
    return this.experienceFormGroup.get('skills') as FormArray;
  }

  get resume() {
    return this.personalFormGroup.get('resume');
  }
  get coverLetter() {
    return this.personalFormGroup.get('coverLetter');
  }

  validateStep(formGroup: FormGroup, stepper: MatStepper) {
    if (formGroup.valid) {
      stepper.next();
    } else {
      Object.keys(formGroup.controls).forEach((field) => {
        formGroup.get(field)?.markAsTouched();
      });
    }
  }
  requireOneFieldValidator() {
    const file = this.personalFormGroup.get('resumeFile')?.value;
    const googleDriveLink =
      this.personalFormGroup.get('googleDriveLink')?.value;
    console.log(file, googleDriveLink);
    return file || googleDriveLink ? null : { require: true };
  }
  validatePhone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^\+?\d{0,10}$/.test(value);
      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }
  ValidateEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/.test(
        value
      );
      return valid ? null : { invalidEmail: control.value };
    };
  }
  addWorkHistory() {
    const data = {
      employerName: this.experienceFormGroup.get('employerName')?.value,
      jobTitle: this.experienceFormGroup.get('jobTitle')?.value,
      startDate: this.experienceFormGroup.get('startDate')?.value,
      endDate: this.experienceFormGroup.get('endDate')?.value,
      jobFunction: this.experienceFormGroup.get('jobFunction')?.value,
    };
    this.workHistories.push(data);
    this.resetWorkHistoryForm();
  }
  removeWorkHistory(index: number): void {
    this.workHistories.splice(index, 1);
  }
  resetWorkHistoryForm() {
    this.experienceFormGroup.get('employerName')?.reset();
    this.experienceFormGroup.get('jobTitle')?.reset();
    this.experienceFormGroup.get('startDate')?.reset();
    this.experienceFormGroup.get('endDate')?.reset();
    this.experienceFormGroup.get('jobFunction')?.reset();
  }
  formatMonth(value: string) {
    const date = new Date(value);
    return `${this.months[date.getMonth()]} ${date.getFullYear()}`;
  }
  addSkills() {
    this.skills.push(this.fb.control(''));
  }
  removeSkills(index: number) {
    this.skills.removeAt(index);
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  triggerCoverInput() {
    this.coverInput.nativeElement.click();
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(event);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedResumeFile = file.name;
      this.personalFormGroup.patchValue({ resumeFile: file.name });
      this.personalFormGroup.get('resumeFile')?.updateValueAndValidity();

      console.log(this.selectedResumeFile);
    }
  }
  onCoverLetterFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCoverLetterFile = file.name;
      this.personalFormGroup.patchValue({ coverLetter: file.name });
      this.personalFormGroup.get('coverLetter')?.updateValueAndValidity();
    }
  }

  handleRemoveResumeFile(): void {
    this.selectedResumeFile = null;
    this.personalFormGroup.patchValue({ resumeFile: null });
    this.personalFormGroup.get('resumeFile')?.updateValueAndValidity();
  }
  handleRemoveCoverLetter(): void {
    this.selectedCoverLetterFile = null;
    this.personalFormGroup.patchValue({ coverLetter: null });
    this.personalFormGroup.get('coverLetter')?.updateValueAndValidity();
  }
  onSubmitApplication(): void {
    if (this.personalFormGroup.valid) {
      console.log('working');
    } else {
      this.isSubmitting = true;
    }
  }
}
