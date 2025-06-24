import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { job } from 'src/app/dashboard/job/shared/job';
import { CORP_URL_KEY, JOB_ID_KEY } from 'src/app/core/model/credential';
@Component({
  selector: 'erecruit-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  id: any;
  minDate: any;
  isFullPageLoading: boolean = false;
  isLoading$!: Observable<boolean>;
  errorMessage: string = '';
  id$!: Observable<string | null>;
  jobData!: job;
  form!: FormGroup;
  encodeUrl!: string | null;

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
    this.isLoading$ = this.jobService.isLoading$;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getJobDetailsById(id);
      if (id) {
        localStorage.setItem(JOB_ID_KEY, id);
      }
    });
    this.jobService.jobDetailData$.subscribe((data) => {
      this.jobData = data;
    });
    this.encodeUrl = localStorage.getItem(CORP_URL_KEY);
  }

  getJobDetailsById(id: string) {
    this.jobService.setLoading(true);
    this.jobService
      .getJobDetailsById(id)
      .pipe(finalize(() => this.jobService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.jobService.setJobDetailData(response.data);
          } else {
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
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
    localStorage.setItem(JOB_ID_KEY, this.jobData?.id);
    this.navigateRoute.navigateByUrl('candidate/login', { replaceUrl: true });
  }

  handleBack() {
    this.location.back();
  }
}
