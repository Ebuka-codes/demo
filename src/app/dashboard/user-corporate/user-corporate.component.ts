import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CorporateService } from '../corporate/shared/corporate.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/shared/service/toast.service';
@Component({
  selector: 'app-user-corporate',
  templateUrl: './user-corporate.component.html',
  styleUrls: ['./user-corporate.component.scss'],
})
export class UserCorporateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  file!: string;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  isLoadingLogo: boolean = false;
  logoUrl!: string;
  corporateId!: string;
  constructor(
    private fb: FormBuilder,
    private corporateService: CorporateService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, this.validateEmail()]],
      logo: [''],
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

  ngOnInit(): void {
    this.getCorporateData();
  }

  getCorporateData() {
    this.loaderService.setLoading(true);
    this.corporateService.getUserCorporate().subscribe({
      next: (response: any) => {
        if (response) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.corporateId = response.id;
          this.loaderService.setLoading(false);
        } else {
          this.loaderService.setLoading(false);
          this.toastService.success(response.message);
        }
      },
      error: (error: any) => {
        this.toastService.success(error.message);
        this.loaderService.setLoading(false);
      },
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

  triggerInput() {
    this.fileInput.nativeElement.click();
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.file = file.name;
      this.convertLogoToBase64(file, file.name);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.file = file.name;
      this.convertLogoToBase64(file, file.name);
    }
  }

  convertLogoToBase64(file: File, name: string): void {
    this.isLoadingLogo = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.loaderService.setLoading(true);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.corporateService.convertFileToBase64(data).subscribe(
        (response: any) => {
          if (response.valid && response.data) {
            this.logoUrl = response.data.path;
            this.isLoadingLogo = false;
            this.loaderService.setLoading(false);
          }
        },
        (error) => {
          this.toastService.error(error.message);
          this.loaderService.setLoading(false);
          this.isLoadingLogo = false;
        }
      );
    };
  }
  removeFile() {
    this.file = '';
    this.logoUrl = '';
  }
  onSubmit() {
    if (this.form.valid) {
      this.submitLoading = true;
      this.loaderService.setLoading(true);
      this.corporateService
        .editCorporate(this.corporateId, {
          ...this.form.value,
          logo: this.logoUrl ? this.logoUrl : this.form.get('logo')?.value,
        })
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.loaderService.setLoading(false);
              this.submitLoading = false;
              this.toastService.success('Corporate updated successfully');
            } else {
              this.toastService.error(response.message);
              this.loaderService.setLoading(false);
              this.submitLoading = false;
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
            this.loaderService.setLoading(false);
            this.submitLoading = false;
          },
        });
    }
  }
}
