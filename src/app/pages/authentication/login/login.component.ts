import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  isNext: boolean = false;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _jobService: JobRecruitService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validateEmail()]],
      term: ['', Validators.required],
    });
    console.log(this._jobService.getJobDetailId());
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
    this.route.navigateByUrl(
      `/job-details/${this._jobService.getJobDetailId()}`,
      {
        replaceUrl: true,
      }
    );
  }
  onSubmit() {
    if (this.form.valid) {
      this.isNext = true;
      this.route.navigateByUrl(
        `/job/apply/${this._jobService.getJobDetailId()}`,
        { replaceUrl: true }
      );
      this._jobService.setCandidateEmail(this.form.get('email')?.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
