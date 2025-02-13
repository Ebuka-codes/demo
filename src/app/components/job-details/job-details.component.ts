import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JobRecruitService } from '../../shared/job-recruit.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import jobDetail from '../../../assets/data.json';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { jobType } from 'src/app/shared/type';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  selectedJob: any = jobDetail;
  id: any;
  minDate: any;
  isLoading: boolean = false;
  errorMessage: string = '';
  id$!: Observable<string | null>;
  data?: jobType;
  @ViewChild('jobFormSection') jobFrom!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  form!: FormGroup;
  isSubmitting: boolean = false;
  constructor(
    private _jobService: JobRecruitService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, this.ValidateEmail()]],
        phone: ['', [Validators.required, this.validatePhone()]],
        linkedinProfile: [''],
        resumeFile: [null],
        googleDriveLink: [''],
        coverLetter: [''],
      },
      { Validators: this.requireOneFieldValidator }
    );
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getJobDetailsById(id);
    });
  }
  getJobDetailsById(id: string) {
    this.isLoading = true;
    this._jobService.getJobDetailsById(id).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.data = response.data;
          console.log(this.data);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.log(this.errorMessage);
        this.isLoading = false;
      },
    });
  }
  scrollToJobFormSection() {
    console.log('Working');
    this.jobFrom.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get resume() {
    return this.form.get('resume');
  }
  get coverLetter() {
    return this.form.get('coverLetter');
  }

  requireOneFieldValidator() {
    const file = this.form.get('resumeFile')?.value;
    const googleDriveLink = this.form.get('googleDriveLink')?.value;
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

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  triggerCoverInput() {
    this.coverInput.nativeElement.click();
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedResumeFile = file.name;
      this.form.patchValue({ resumeFile: file.name });
      this.form.get('resumeFile')?.updateValueAndValidity();
    }
  }
  onCoverLetterFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedCoverLetterFile = file.name;
      this.form.patchValue({ coverLetter: file.name });
      this.form.get('coverLetter')?.updateValueAndValidity();
    }
  }
  handleRemoveResumeFile(): void {
    this.selectedResumeFile = null;
    this.form.patchValue({ resumeFile: null });
    this.form.get('resumeFile')?.updateValueAndValidity();
  }

  handleRemoveCoverLetter(): void {
    this.selectedCoverLetterFile = null;
    this.form.patchValue({ coverLetter: null });
    this.form.get('coverLetter')?.updateValueAndValidity();
  }

  onSubmitApplication(): void {
    if (this.form.valid) {
      console.log('working');
    } else {
      this.isSubmitting = true;
    }
  }

  // ngOnInit(): void {
  //   this._jobService.selectedJob$.subscribe((jobDetails) => {
  //     this.selectedJob = jobDetails;
  //   });
  // }
}
