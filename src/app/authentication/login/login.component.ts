import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  isNext: boolean = false;
  constructor(private fb: FormBuilder, private route: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail()]],
      term: ['', Validators.required],
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
  onSubmit() {
    if (this.form.valid) {
      this.isNext = true;
      this.route.navigateByUrl('/job/apply', { replaceUrl: true });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
