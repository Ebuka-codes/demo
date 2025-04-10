import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Corporate } from '../shared/corporate';
import { CorporateService } from '../shared/corporate.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-corporate-create',
  templateUrl: './corporate-create.component.html',
  styleUrls: ['./corporate-create.component.scss'],
})
export class CorporateCreateComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() corporateCreated: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  data: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  isLoadingLogo: boolean = false;
  file!: string;
  constructor(
    private fb: FormBuilder,
    public corporateService: CorporateService,
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

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
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
  createCorporate(corporate: Corporate) {
    this.submitLoading = true;
    this.loaderService.setLoading(true);
    this.corporateService.createCorporate(corporate).subscribe({
      next: (response: any) => {
        this.submitLoading = false;
        this.form.reset();
        this.isSubmitted = false;
        this.loaderService.setLoading(false);
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.toastService.success('Corporate created successfully');
        this.corporateCreated.emit();
      },
      error: (error) => {
        this.submitLoading = false;
        this.form.reset();
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
      },
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.createCorporate({ ...this.form.value, logo: this.logoUrl });
    } else {
      this.form.markAllAsTouched();
    }
  }
  resetForm() {
    this.form.reset();
    this.file = '';
  }
}
