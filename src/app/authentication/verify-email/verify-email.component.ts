import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CorporateDto } from 'src/app/core/model/auth';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { SignupDataService } from '../shared/signup-data.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  @ViewChildren('otpInputs') otpInputs!: QueryList<any>;
  otpForm: FormArray<FormControl<string | null>>;
  isVerifyEnabled: boolean = false;
  isLoading: boolean = false;
  userData: any;
  otp!: string;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private signupDataService: SignupDataService
  ) {
    this.otpForm = this.fb.array(
      new Array(6).fill('').map(() => new FormControl(''))
    );
  }
  ngOnInit(): void {
    this.signupDataService.getRegisterData().subscribe((data) => {
      if (data) {
        this.userData = data;
        this.isLoading = true;
        this.authService
          .generateOtp({
            email: this.userData?.email,
            phoneNumber: this.userData?.phoneNumber,
          })
          .subscribe({
            next: (response: any) => {
              if (response.valid && response.data) {
                setTimeout(() => {
                  this.isLoading = false;
                }, 500);
                console.log(`otp code - ${response.data}`);
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.toastService.error(err.message);
            },
          });
      }
    });
  }
  onInput(index: number, event: any) {
    const input = event.target;
    if (input.value && index < this.otpInputs?.length - 1) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
    this.checkComplete();
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text')?.trim() || '';
    console.log(pastedData.length);
    if (pastedData.length === 6) {
      pastedData.split('').forEach((char, index) => {
        this.otpForm.at(index)?.setValue(char);
      });

      this.checkComplete();
    }
  }
  checkComplete() {
    this.isVerifyEnabled = this.otpForm.value.every(
      (value: string | null) => value?.length === 1
    );
  }

  onVerify() {
    if (this.isVerifyEnabled) {
      const corporate: CorporateDto = {
        corporateInfo: {
          name: this.userData?.name,
        },
        userDTO: {
          firstName: this.userData?.name,
          lastName: 'admin',
          email: this.userData?.email,
          otp: this.otpForm.value.join(''),
          password: this.userData?.password,
          phoneNumber: this.userData?.phoneNumber,
        },
      };
      this.isLoading = true;
      this.authService.signUp(corporate).subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.isLoading = false;
            this.otpForm.reset();
            setTimeout(() => {
              this.isLoading = false;
              this.route.navigateByUrl('/login');
            }, 300);
          } else {
            this.isLoading = false;
            this.toastService.error(response.message);
            this.otpForm.reset();
            this.checkComplete();
          }
        },
        error: (error) => {
          this.toastService.error(error.error.message);
          this.isLoading = false;
        },
      });
    }
  }
}
