import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
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
import { CorporateService } from '../shared/corporate.service';
import * as bootstrap from 'bootstrap';
import { Corporate } from '../shared/corporate';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { UtilService } from 'src/app/core/service/util.service';
@Component({
  selector: 'app-corporate-edit',
  templateUrl: './corporate-edit.component.html',
  styleUrls: ['./corporate-edit.component.scss'],
})
export class CorporateEditComponent {
  @ViewChild('myEditModal') modalElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() editedData!: Corporate;
  @Output() corporateEdited: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;

  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  data: any[] = [];
  searchText: string = '';
  isLoadingLogo: boolean = false;
  isLoading!: Observable<boolean>;
  file!: string;
  constructor(
    private fb: FormBuilder,
    public corporateService: CorporateService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private utilService: UtilService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, this.validateEmail()]],
      hmCode: ['', Validators.required],
      logo: [''],
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.form.patchValue(this.editedData);
    }
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
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
      const valid = /^\+?\d{0,11}$/.test(value);
      return valid ? null : { invalidPhone: { value: control.value } };
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
      this.utilService.convertFileTobase64(data).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.logoUrl = response.data.path;
            this.isLoadingLogo = false;
            this.loaderService.setLoading(false);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.loaderService.setLoading(false);
          this.isLoadingLogo = false;
        },
      });
    };
  }

  removeFile() {
    this.file = '';
    this.logoUrl = '';
  }

  editCorporate(id: string, data: Corporate) {
    this.submitLoading = true;
    this.loaderService.setLoading(true);

    this.corporateService.editCorporate(id, data).subscribe({
      next: () => {
        this.submitLoading = false;
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.corporateEdited.emit();
        this.toastService.success('Corporate updated successfully');
        this.loaderService.setLoading(false);
      },

      error: (err) => {
        this.submitLoading = false;
        this.toastService.error(err.message);
        this.loaderService.setLoading(false);
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
      },
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.editCorporate(this.editedData.id, {
        ...this.form.value,
        logo: this.logoUrl ? this.logoUrl : this.editedData.logo,
      });

      this.isSubmitted = false;
    }
  }
  resetForm() {
    this.form.patchValue(this.editedData);
    this.file = '';
    this.isSubmitted = false;
  }
}
