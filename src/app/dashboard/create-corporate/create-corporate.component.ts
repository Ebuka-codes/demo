import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Notyf } from 'notyf';
import { Corporate } from 'src/app/shared/type';

@Component({
  selector: 'app-create-corporate',
  templateUrl: './create-corporate.component.html',
  styleUrls: ['./create-corporate.component.scss'],
})
export class CreateCorporateComponent {
  @ViewChild('inputLogo') inputLogo!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  notyf = new Notyf();
  data: any[] = [];

  constructor(private jobService: DashboardService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, this.validatePhone()]],
      email: ['', [Validators.required, this.validateEmail()]],
      logo: ['', Validators.required],
      hmCode: ['', Validators.required],
    });
  }

  get name() {
    return this.form.get('name');
  }
  get address() {
    return this.form.get('address');
  }
  get phone() {
    return this.form.get('phone');
  }
  get email() {
    return this.form.get('email');
  }
  get logo() {
    return this.form.get('logo');
  }
  get hmCode() {
    return this.form.get('hmCode');
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
  validatePhone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const valid = /^\+?\d{0,10}$/.test(value);
      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }

  createCorporate(corporate: Corporate) {
    this.isSubmitting = true;
    this.jobService.createCorporate(corporate).subscribe({
      next: () => {
        this.notyf.success({
          message: 'Corporate created successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.reset();
        this.form.enable();

        this.isSubmitting = false;
      },

      error: () => {
        this.isSubmitting = false;
        this.form.enable();
        this.form.reset();
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.files);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.convertResumeToBase64(file, file.name);
      input.value = '';
    }
  }

  convertResumeToBase64(file: File, name: string): void {
    this.jobService.setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.jobService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
            this.logoUrl = response.data.path;
            this.jobService.setLoading(true);
          }
        },
        (err) => {
          this.notyf.error({
            message: err.error.message,
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });

          this.jobService.setLoading(true);
        }
      );
    };
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.createCorporate({ ...this.form.value, logo: this.logoUrl });

      this.isSubmitted = false;
    }
  }
}
