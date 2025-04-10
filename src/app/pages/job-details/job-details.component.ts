import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { job } from 'src/app/shared/type';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  id: any;
  minDate: any;
  isFullPageLoading: boolean = false;
  isLoading!: boolean;
  errorMessage: string = '';
  id$!: Observable<string | null>;
  jobData!: job;
  form!: FormGroup;
  constructor(
    private jobService: JobRecruitService,
    private navigateRoute: Router,
    private location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail()]],
      term: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getJobDetailsById(id);
      if (id) {
        localStorage.setItem('jobId', id);
      }
    });
    this.jobService.jobDetailData$.subscribe((data) => {
      this.jobData = data;
    });
  }

  getJobDetailsById(id: string) {
    this.isLoading = true;
    this.jobService.getJobDetailsById(id).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.jobService.setJobDetailData(response.data);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.jobService.setLoading(false);
      },
    });
  }
  validateEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/.test(
        value
      );
      return valid ? null : { invalidEmail: control.value };
    };
  }
  get email() {
    return this.form.get('email');
  }
  get term() {
    return this.form.get('term');
  }
  handleApplyJob() {
    localStorage.setItem('JobId', this.jobData?.id);
    this.navigateRoute.navigateByUrl('candidate/login', { replaceUrl: true });
  }

  handleBack() {
    this.location.back();
  }
}
