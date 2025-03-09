import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
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
import { Notyf } from 'notyf';
import { CorporateService } from '../shared/corporate.service';
import { DashboardService } from '../../dashboard.service';
import * as bootstrap from 'bootstrap';
import { Corporate } from '../shared/corporate';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-corporate-edit',
  templateUrl: './corporate-edit.component.html',
  styleUrls: ['./corporate-edit.component.scss'],
})
export class CorporateEditComponent {
  @ViewChild('myEditModal') modalElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() editedData!: Corporate;
  @Output() onEditCorporate: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;

  form!: FormGroup;
  submitLoading: boolean = false;
  isSubmitted: boolean = false;
  logoUrl: string = '';
  notyf = new Notyf();
  data: any[] = [];
  searchText: string = '';
  isLoadingLogo: boolean = false;
  isLoading!: Observable<boolean>;
  file!: string;
  constructor(
    private fb: FormBuilder,
    public corporateService: CorporateService,
    private dashboardService: DashboardService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, this.validatePhone()]],
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
      const valid = /^\+?\d{0,10}$/.test(value);
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
    this.dashboardService.setLoading(true);
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
            this.dashboardService.setLoading(false);
          }
        },
        (err) => {
          this.notyf.error({
            message: err.error.message,
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });

          this.dashboardService.setLoading(false);
          this.isLoadingLogo = false;
        }
      );
    };
  }

  removeFile() {
    this.file = '';
    this.logoUrl = '';
  }

  editCorporate(id: string, data: Corporate) {
    this.submitLoading = true;
    this.dashboardService.setLoading(true);
    this.form.disable();
    this.corporateService.editCorporate(id, data).subscribe({
      next: () => {
        this.submitLoading = false;
        this.modalInstance.hide();
        this.form.enable();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.onEditCorporate.emit();
        this.dashboardService.setLoading(false);
        this.notyf.success({
          message: 'Corporate updated successfully!',
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
      },
      error: (err) => {
        this.submitLoading = false;
        this.notyf.error({
          message: err.error.message,
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.dashboardService.setLoading(false);
        this.modalInstance.hide();
        this.form.enable();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
      },
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      console.log('not valid');
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
