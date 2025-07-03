import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { SignupDataService } from '../shared/signup-data.service';
import { PrivacyPolicyModalComponent } from 'src/app/shared/components/privacy-policy-modal/privacy-policy-modal.component';
import { UtilService } from 'src/app/core/service/util.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild(PrivacyPolicyModalComponent)
  PrivacyPolicyModalComponent!: PrivacyPolicyModalComponent;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  isLoading: boolean = false;
  isPassword: boolean = false;
  isConfirmPassword: boolean = false;
  checkConfirmPassword: boolean = false;
  agreed: boolean = false;
  file!: string;

  constructor(
    private fb: FormBuilder,
    private signupDataService: SignupDataService,
    private route: Router,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
      agreeTerm: [false, Validators.requiredTrue],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$'
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required, this.checkPassword()]],
    });
  }

  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get agreeTerm() {
    return this.form.get('agreeTerm');
  }

  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {}

  togglePasswords(value: string) {
    if (value === 'password') {
      this.isPassword = !this.isPassword;
    }
    if (value === 'confirmPassword') {
      this.isConfirmPassword = !this.isConfirmPassword;
    }
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      if (!/^\d+$/.test(value)) {
        return { invalidNumber: 'Phone number must contain only digits' };
      }
      if (value.startsWith('0')) {
        return value.length === 11
          ? null
          : {
              invalidLength: 'Phone number is invalid',
            };
      }
      if (!value.startsWith('1')) {
        return value.length === 10
          ? null
          : {
              invalidLength: 'Phone number is invalid',
            };
      }

      return null;
    };
  }

  triggerInput() {
    this.fileInput.nativeElement.click();
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.file = file.name;
      this.convertLogoToBase64(file, file.name);
    }
  }

  convertLogoToBase64(file: File, name: string): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.utilService.unprotectedFileBase64(data).subscribe(
        (response) => {
          if (response.valid && response.data) {
            this.form.get('logo')?.setValue(response.data.path);
            console.log(response.data.path);
          } else {
            this.toastService.error(response.message);
          }
        },
        (error) => {
          this.toastService.error(error.message);
          this.removeFile();
        }
      );
    };
  }
  removeFile() {
    this.file = '';
    this.form.get('logo')?.setValue('');
  }
  checkPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.parent) {
        return null;
      }
      return control?.value.trim() === this.password?.value.trim()
        ? null
        : { invalidPassword: true };
    };
  }

  openPrivacyModal() {
    this.PrivacyPolicyModalComponent.open();
  }

  checkTerm() {
    this.agreed = true;
    this.agreeTerm?.setValue(true);
  }
  onSubmit() {
    if (
      this.form.valid &&
      this.form.get('password')?.value ===
        this.form.get('confirmPassword')?.value
    ) {
      const userData = {
        ...this.form.value,
        phoneNumber: this.form
          .get('phoneNumber')
          ?.value.toString()
          .padStart(11, '0'),
      };
      this.isLoading = true;
      setTimeout(() => {
        this.signupDataService.setRegisterDta(userData);
        this.route.navigateByUrl('/verify-email');
        this.isLoading = false;
      }, 1000);
    } else if (
      this.form.valid &&
      this.form.get('password')?.value !==
        this.form.get('confirmPassword')?.value
    ) {
      this.form.get('confirmPassword')?.setErrors([this.checkPassword()]);
      this.checkConfirmPassword = true;
    } else {
      this.form.markAllAsTouched();
    }
  }
}
