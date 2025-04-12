import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class CandidateLoginComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  form!: FormGroup;
  isLoading!: Observable<boolean>;
  isSignIn: boolean = false;
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
          const id = response?.data?.id;
          console.log(id, 'me and you');
          this.router.navigate([`apply/${id}`], { relativeTo: this.route });
        },
      });
  }
  resetForm() {
    this.form.reset();
    this.isSignIn = false;
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
              console.log(response.data);
              this.getUserData(this.form.get('email')?.value);
              this.loaderService.setLoading(false);
              this.modalInstance.hide();
              const backdrop = document.querySelector('.modal-backdrop');
              backdrop?.remove();
              document.body.removeAttribute('style');
              document.body.classList.add('force-scroll-reset');
            } else {
              this.loaderService.setLoading(false);
              this.router.navigate(['apply'], { relativeTo: this.route });
              this.modalInstance.hide();
              const backdrop = document.querySelector('.modal-backdrop');
              document.body.classList.add('force-scroll-reset');
              backdrop?.remove();
              document.body.removeAttribute('style');
            }
          },
          error: (err) => {
            this.loaderService.setLoading(false);
            this.toastService.error(err.message);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
