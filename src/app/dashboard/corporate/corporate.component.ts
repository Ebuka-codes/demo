import { Component, ElementRef, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Modal } from 'bootstrap';
import { CorporateService } from './shared/corporate.service';
import { Corporate } from './shared/corporate';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss'],
})
export class CorporateComponent {
  @ViewChild('inputLogo') inputLogo!: ElementRef<HTMLInputElement>;
  modalInstance!: Modal;

  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  data!: any[];
  searchText: string = '';
  isLoading$!: Observable<any>;
  filteredData: Array<Corporate> = [];
  isLoadingLogo: boolean = false;
  editedData: any;
  corporateViewData: any;
  corpkey = new FormControl();
  corporateId!: string;
  constructor(
    private fb: FormBuilder,
    public corporateService: CorporateService,
    private toastService: ToastService,
    public loaderService: LoaderService
  ) {
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

  handleGetCorpKey() {
    if (this.corpkey) {
      this.loaderService.setLoading(true);
      setTimeout(() => {
        localStorage.setItem('corp-key', this.corpkey.value);
        this.loaderService.setLoading(false);
        this.corpkey.setValue('');
        this.toastService.success('Corporate switched successfully!');
      }, 2000);
    }
  }
  getCorporate() {
    this.loaderService.setLoading(true);
    this.submitLoading = true;
    this.corporateService.getCorporate().subscribe({
      next: (response: any) => {
        if (response) {
          this.data = response;
          this.filteredData = [...this.data];
          this.submitLoading = false;
          this.loaderService.setLoading(false);
        }
      },

      error: () => {
        this.submitLoading = false;
        this.loaderService.setLoading(false);
        this.toastService.error('Network Connection Error!');
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
  convertResumeToBase64(file: File, name: string): void {
    this.isLoadingLogo = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.loaderService.setLoading(true);
    reader.onload = () => {
      const data = {
        base64String: reader.result as string,
        fileName: name,
      };
      this.corporateService.convertFileToBase64(data).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.logoUrl = response.data.path;
            this.isLoadingLogo = false;
            this.loaderService.setLoading(false);
          }
        },
        error: (err) => {
          this.toastService.error('Network Connection Error!');
          this.loaderService.setLoading(false);
          this.isLoadingLogo = false;
        },
      });
    };
  }

  resetForm() {
    this.form.reset();
    this.isSubmitted = false;
  }
  handleDeleteCorporate(id: string) {
    this.corporateId = id;
  }

  handleEditCorporate(id: string) {
    this.editedData = this.filteredData?.find((item) => item.id === id);
  }
  handleViewCorporate(id: string) {
    this.corporateViewData = this.filteredData?.find((item) => item.id === id);
  }
}
