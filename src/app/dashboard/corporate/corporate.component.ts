import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Notyf } from 'notyf';
import { Corporate } from 'src/app/shared/type';
import { DashboardService } from '../dashboard.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss'],
})
export class CorporateComponent implements OnInit {
  @ViewChild('inputLogo') inputLogo!: ElementRef<HTMLInputElement>;
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  notyf = new Notyf();
  data: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  filteredData: Array<any> = [];
  isLoadingLogo: boolean = false;
  constructor(private fb: FormBuilder, private jobService: DashboardService) {
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

  ngOnInit() {
    this.getCorporate();
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.files);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.convertResumeToBase64(file, file.name);
      input.value = '';
    }
  }

  handleSearch() {
    if (this.searchText.trim() === '') {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((item: any) =>
        item.name?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
  convertResumeToBase64(file: File, name: string): void {
    this.isLoading = true;
    this.isLoadingLogo = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.jobService.setLoading(true);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.jobService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
            this.logoUrl = response.data.path;
            this.isLoadingLogo = false;
            this.jobService.setLoading(false);

            console.log(this.logoUrl);
          }
        },
        (err) => {
          this.notyf.error({
            message: err.error.message,
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });

          this.jobService.setLoading(false);
          this.isLoadingLogo = false;
        }
      );
    };
  }

  resetForm() {
    this.form.reset();
  }
  getCorporate() {
    this.jobService.setLoading(true);
    this.jobService.getCorporate().subscribe({
      next: (response: any) => {
        this.submitLoading = false;
        if (response) {
          this.data = response;
          this.filteredData = [...this.data];

          console.log(this.filteredData);
        }
        this.jobService.setLoading(false);
      },

      error: () => {
        this.submitLoading = false;
        this.jobService.setLoading(false);
        this.notyf.error({
          message: 'Error occur!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      },
    });
  }
  createCorporate(corporate: Corporate) {
    this.submitLoading = true;
    this.form.disable();
    this.jobService.createCorporate(corporate).subscribe({
      next: () => {
        this.submitLoading = false;
        this.notyf.success({
          message: 'Corporate created successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.form.reset();
        this.form.enable();
        this.isSubmitted = false;
        this.getCorporate();

        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
      },

      error: () => {
        this.submitLoading = false;
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
  onSubmit() {
    this.isSubmitted = false;
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.createCorporate({ ...this.form.value, logo: this.logoUrl });

      this.isSubmitted = false;
    }
  }
}
