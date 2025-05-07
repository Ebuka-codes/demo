import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { CandidateService } from 'src/app/shared/service/candidate.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'erecruit-candidate-verification',
  templateUrl: './candidate-verification.component.html',
  styleUrls: ['./candidate-verification.component.scss'],
})
export class CandidateVerificationComponent implements OnInit {
  form!: FormGroup;
  token!: any;
  isLoading$!: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private candidteService: CandidateService,
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

    this.candidteService.sendCandiateOtp({ token: this.token }).subscribe({
      next: (response: any) => {
        if (response.valid) {
          console.log('token sent');
        } else {
          console.log('token not sent'.toString);
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
      const otp = this.form.get('otp')?.value.toString().trim();
      this.candidteService
        .verifyCandidate({
          otp: otp,
          token: this.token,
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              sessionStorage.setItem(
                'recruitData',
                JSON.stringify(response.data.messageResponse)
              );
              this.router.navigate([`/recruiter-message/${this.token}`]);
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
  requestOTP() {
    window.location.reload();
  }
}
