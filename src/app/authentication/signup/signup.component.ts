import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  form!: FormGroup;
  isLoading: boolean = false;
  isPassword: boolean = false;
  isConfirmPassword: boolean = false;
  checkConfirmPassword: boolean = false;
  checkTerm: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {
    this.form = this.fb.group({
      userType: ['', Validators.required],
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
  get userType() {
    return this.form.get('userType');
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

  checkIdentification(): ValidationErrors | null {
    return (control: AbstractControl) => {
      if (!control.parent) {
        return;
      }
      return this.form.get('corporate')?.value === true ||
        this.form.get('freelancerAgency')?.value === true
        ? null
        : { required: true };
    };
  }
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

  checkPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.parent) {
        return null;
      }
      return control.value.trim() === this.form.get('password')?.value.trim()
        ? null
        : { invalidPassword: true };
    };
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
      this.authService.setUserData(userData);
      this.form.reset();
      this.route.navigateByUrl('/verify-email');
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
