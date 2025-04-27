import {
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, take } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { CandidateService } from 'src/app/shared/service/candidate.service';
import { Modal } from 'bootstrap';

import * as bootstrap from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-candidate-login',
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.scss'],
})
export class CandidateLoginComponent implements OnInit {
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  form!: FormGroup;
  isLoading!: Observable<boolean>;
  isSignIn: boolean = false;
  jobId!: string | null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private location: Location,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail()]],
      term: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = localStorage.getItem('jobId');
    if (id) {
      this.jobId = id;
    }
  }
  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
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
  handleBack() {
    this.location.back();
  }
  getUserData(email: string) {
    this.candidateService
      .getLoggedInCandidte(email)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          const candidateId = response?.data?.id;
          this.router.navigate([
            '/apply',
            this.jobId,
            'application',
            candidateId,
          ]);
        },
      });
  }
  resetForm() {
    this.form.reset();
    this.isSignIn = false;
  }

  closeModal() {
    this.loaderService.setLoading(false);
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
    document.body.removeAttribute('style');
    document.body.classList.add('force-scroll-reset');
  }
  onLogin() {
    if (this.form.valid) {
      this.loaderService.setLoading(true);
      this.isSignIn = true;
      this.candidateService
        .candidateLogin(this.form.get('email')?.value)
        .subscribe({
          next: (response: any) => {
            if (response.data === true) {
              this.candidateService
                .getLoggedInCandidte(this.form.get('email')?.value)
                .pipe(take(1))
                .subscribe({
                  next: (response: any) => {
                    const candidateId = response?.data?.id;
                    this.router.navigate([
                      '/apply',
                      this.jobId,
                      'application',
                      candidateId,
                    ]);
                    this.closeModal();
                  },
                });
            } else {
              this.loaderService.setLoading(false);
              this.router.navigate(['/apply', this.jobId, 'application'], {
                relativeTo: this.route,
              });
              this.closeModal();
            }
          },
          error: (err) => {
            this.loaderService.setLoading(false);
            this.toastService.error(err.message);
            this.closeModal();
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
