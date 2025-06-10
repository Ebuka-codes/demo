import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginType } from 'src/app/core/model/auth';
import { TokenService } from 'src/app/core/service/token.service';
import { ToastService } from 'src/app/core/service/toast.service';

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
    private route: Router,
    private tokenService: TokenService
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
  onLogin(data: LoginType) {
    this.isLoading = true;
    this.authService.login(data).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.isLoading = false;
          this.tokenService.setToken(response.data);
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
      this.onLogin(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  togglePasswords() {
    this.isPassword = !this.isPassword;
  }
}
