import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent {
  form: FormGroup;
  isLoading: boolean = false;
  isPassword: boolean = false;
  isConfirmPassword: boolean = false;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(7)],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  togglePasswords(value: string) {
    if (value === 'password') {
      this.isPassword = !this.isPassword;
    }
    if (value === 'confirmPassword') {
      this.isConfirmPassword = !this.isConfirmPassword;
    }
  }
  checkPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return value.trim() === this.password?.value.trim()
        ? null
        : { invalidPassword: control.value };
    };
  }
  onSubmit() {
    if (this.form.valid) {
    } else {
      this.form.markAllAsTouched();
    }
  }
}
