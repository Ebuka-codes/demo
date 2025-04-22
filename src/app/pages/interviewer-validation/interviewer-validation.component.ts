import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { InterviewerService } from 'src/app/shared/service/interviewer.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-interviewer-validation',
  templateUrl: './interviewer-validation.component.html',
  styleUrls: ['./interviewer-validation.component.scss'],
})
export class InterviewerValidationComponent {
  form!: FormGroup;
  token!: any;
  isLoading$!: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private interviewerService: InterviewerService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      otp: ['', Validators.required],
    });
    this.isLoading$ = this.loaderService.isLoading$;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });

    this.interviewerService.sendInterviewrOtp({ token: this.token }).subscribe({
      next: (response: any) => {
        if (response.valid) {
          console.log('token sent');
        } else {
          console.log('token not sent');
          this.toastService.error(response.message);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastService.error(error.message);
      },
    });
  }
  onVerify() {
    if (this.form.valid) {
      this.loaderService.setLoading(true);
      this.interviewerService
        .verifyInterviewer({
          ...this.form.value,
          token: this.token,
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              sessionStorage.setItem(
                'feedback-data',
                JSON.stringify(response.data)
              );
              this.getCandidateInfo();
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  getCandidateInfo() {
    this.loaderService.setLoading(true);
    return this.interviewerService
      .interviewedCandidate(this.token)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            sessionStorage.setItem(
              'candidate-data',
              JSON.stringify(response.data)
            );
            this.router.navigate([`/feedback-response/${this.token}`]);
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
  requestOTP() {
    window.location.reload();
  }
}
