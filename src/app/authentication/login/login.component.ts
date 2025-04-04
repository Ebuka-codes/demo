import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoginType } from '../shared/auth';
import { Router } from '@angular/router';
import { USER_TOKEN_KEY } from '../shared/credential';

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
    private authService: AuthService,
    private toastService: ToastService,
    private route: Router
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
  handleLogin(data: LoginType) {
    this.isLoading = true;
    this.authService.login(data).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.isLoading = false;
          localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(response.data));
          this.route.navigateByUrl('/dashboard');
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
      console.log(this.form.value);
      this.handleLogin(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  togglePasswords() {
    this.isPassword = !this.isPassword;
  }
}
