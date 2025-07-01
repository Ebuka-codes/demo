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
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { CORP_URL } from 'src/app/core/model/credential';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/core/service/util.service';
@Component({
  selector: 'erecruit-user-corporate',
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
  endcodeUrl!: string;
  jobListingUrl!: string;
  PORT_URL = environment.PORT_URL;

  constructor(
    private fb: FormBuilder,
    private corporateService: CorporateService,
    private toastService: ToastService,
    private location: Location,
    private clipboard: Clipboard,
    private utilService: UtilService
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
    this.getEncodUrl();
  }

  getEncodUrl() {
    const encodeUrl = localStorage.getItem(CORP_URL);
    if (encodeUrl) {
      this.jobListingUrl = `${this.PORT_URL}/job-listing/${encodeUrl}`;
    }
  }
  getCorporateData() {
    this.corporateService.getUserCorporate().subscribe({
      next: (response: any) => {
        if (response) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.corporateId = response.id;
        } else {
          this.toastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
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
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.utilService
        .convertFileTobase64(data)
        .pipe(
          finalize(() => {
            this.isLoadingLogo = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.valid && response.data) {
              this.logoUrl = response.data.path;
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
          },
        });
    };
  }
  removeFile() {
    this.file = '';
    this.logoUrl = '';
  }
  onSubmit() {
    if (this.form.valid) {
      this.submitLoading = true;

      this.corporateService
        .editCorporate(this.corporateId, {
          ...this.form.value,
          logo: this.logoUrl ? this.logoUrl : this.form.get('logo')?.value,
        })
        .pipe(
          finalize(() => {
            this.submitLoading = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response) {
              this.submitLoading = false;
              this.toastService.success('Corporate updated successfully');
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
          },
        });
    }
  }
  onNavigateBack() {
    this.location.back();
  }

  onCopyUrl() {
    this.clipboard.copy(`${this.jobListingUrl}`);
  }
}
