import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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
import { ToastService } from 'src/app/core/service/toast.service';
import { CANDIATE_EMAIL, JOB_ID_KEY } from 'src/app/shared/model/credential';
import { PrivacyPolicyModalComponent } from 'src/app/shared/components/privacy-policy-modal/privacy-policy-modal.component';
@Component({
  selector: 'erecruit-candidate-login',
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.scss'],
})
export class CandidateLoginComponent implements OnInit, AfterViewInit {
  @ViewChild('modalRoot') modalElementRef!: ElementRef<HTMLDivElement>;
  @ViewChild(PrivacyPolicyModalComponent)
  PrivacyPolicyModalComponent!: PrivacyPolicyModalComponent;
  modalInstance!: Modal;
  modalPrivacyInstance!: Modal;
  form!: FormGroup;
  isLoading!: boolean;
  isSignIn: boolean = false;
  jobId!: string | null;
  agreed!: boolean;
  emailText!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private location: Location,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail()]],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    const id = localStorage.getItem(JOB_ID_KEY);
    if (id) {
      this.jobId = id;
    }
  }

  ngAfterViewInit() {
    this.modalInstance = Modal.getOrCreateInstance(
      this.modalElementRef.nativeElement
    );
    this.modalElementRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        // Ensure the cleanup happens after hide()
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    );
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
    return this.form.get('terms');
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

  onLogin() {
    if (this.form.valid) {
      this.isLoading = true;
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
                    this.toastService.success(response.message);
                    this.router.navigate([
                      '/apply',
                      this.jobId,
                      'application',
                      candidateId,
                    ]);
                    this.close();
                  },
                });
            } else {
              this.router.navigate(['/apply', this.jobId, 'application'], {
                relativeTo: this.route,
              });
              this.close();
            }
          },
          error: (err) => {
            this.toastService.error(err.message);
            this.isLoading = false;
          },
        });
      localStorage.setItem(CANDIATE_EMAIL, this.email.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  open() {
    this.modalInstance.show();
  }
  close() {
    this.modalInstance.hide();
    this.isSignIn = false;
  }

  openPrivacyModal() {
    this.emailText = this.email?.value;
    this.close();
    this.PrivacyPolicyModalComponent.open();
    this.form.reset();
  }

  checkTerms() {
    this.agreed = true;
    this.term?.setValue(true);
    this.email?.setValue(this.emailText);
    this.open();
  }
}
