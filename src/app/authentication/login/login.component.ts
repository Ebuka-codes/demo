import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { CoreService } from 'src/app/core/service/core.service';
import { LoginRequest } from 'src/app/shared/model/credential';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  isPassword: boolean = false;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private coreService: CoreService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$'
          ),
        ],
      ],
    });
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  onLogin(data: LoginRequest) {
    this.isLoading = true;
    this.coreService.login(data).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.isLoading = false;
          let sub = this.coreService.loginEvent(response.data).subscribe(
            (data) => {
              this.isLoading = false;
              this.router.navigateByUrl('/dashboard');
            },
            (error) => {
              this.toastService.error(error.message);

              if (sub) {
                sub.unsubscribe();
              }
            },
            () => {
              if (sub) {
                sub.unsubscribe();
              }
            }
          );
        } else {
          this.isLoading = false;
          this.toastService.error(response.message);
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.onLogin(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  togglePasswords() {
    this.isPassword = !this.isPassword;
  }
}
