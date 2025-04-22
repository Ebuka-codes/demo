import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { CandidateService } from 'src/app/shared/service/candidate.service';

@Component({
  selector: 'app-recruiter-message',
  templateUrl: './recruiter-message.component.html',
  styleUrls: ['./recruiter-message.component.scss'],
})
export class RecruiterMessageComponent implements OnInit {
  form!: FormGroup;
  isLoading!: boolean;
  recruiterData: any;
  token!: string | null;
  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      content: ['', Validators.required],
    });
  }
  ngOnInit() {
    const data = sessionStorage.getItem('recruitData');
    if (!data) {
      this.router.navigate(['/']);
    } else {
      this.recruiterData = data;
      this.recruiterData = JSON.parse(data);
    }
    this.token = this.route.snapshot.paramMap.get('token');
  }
  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.candidateService
        .candidateResponse(this.token, this.form.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid) {
              this.toastService.success(response.message);
              this.form.get('content')?.setValue('');
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
}
