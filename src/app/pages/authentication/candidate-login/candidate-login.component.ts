import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, take } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.scss'],
})
export class CandidateLoginComponent {
  form!: FormGroup;
  isNext: boolean = false;
  isLoading!: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private authService: AuthService,
    private location: Location,
    private loaderService: LoaderService
  ) {
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
  handleBack() {
    this.location.back();
  }
  getUserData(email: string) {
    this.authService
      .getLoggedInUserData(email)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          const id = response?.data?.id;
          console.log(id);
          this.route.navigateByUrl(`/job/apply/${id}`, {
            replaceUrl: true,
          });
          this.isNext = true;
        },
      });
  }
  onSubmit() {
    if (this.form.valid) {
      this.loaderService.setLoading(true);
      this.isLoading = this.loaderService.isLoading$;
      this.authService.login(this.form.get('email')?.value).subscribe({
        next: (response: any) => {
          if (response.data === true) {
            this.getUserData(this.form.get('email')?.value);
            this.isNext = true;
            this.loaderService.setLoading(false);
          } else {
            this.isNext = true;
            this.loaderService.setLoading(false);
            this.route.navigateByUrl(`/job/apply`, {
              replaceUrl: true,
            });
          }
        },
        error: (err) => {
          this.isNext = false;
          this.loaderService.setLoading(false);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
