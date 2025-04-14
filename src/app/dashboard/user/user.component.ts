import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  userForm: FormGroup;
  modalInstance!: Modal;
  submitLoading!: boolean;
  userRoleData!: any[];
  userData!: any[];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loaderService: LoaderService,
    private toasterService: ToastService,
    private location: Location
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{11}$')],
      ],
      role: ['', [Validators.required]],
    });
  }
  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }
  get role() {
    return this.userForm.get('role');
  }

  ngOnInit() {
    this.loaderService.setLoading(true);
    this.userService.getUserRole().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userRoleData = response.data;
          this.loaderService.setLoading(false);
        } else {
          this.loaderService.setLoading(true);
        }
      },
      error: () => {
        this.loaderService.setLoading(true);
      },
    });
    this.loadUsers();
  }
  loadUsers(): void {
    this.loaderService.setLoading(true);
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userData = response.data;
          this.loaderService.setLoading(false);
        } else {
          console.log('error');
          this.loaderService.setLoading(false);
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        this.toasterService.error(error);
      },
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
  }
  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
  }
  onSubmit(): void {
    if (this.userForm.valid) {
      this.loaderService.setLoading(true);
      this.submitLoading = true;
      this.userService.createUser(this.userForm.value).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.loaderService.setLoading(false);
            this.toasterService.success('User created successfully');
            this.closeModal();
            this.submitLoading = false;
            this.loadUsers();
          } else {
            this.loaderService.setLoading(false);
            this.toasterService.error(response.message);
            this.closeModal();
            this.submitLoading = false;
          }
        },
        error: (error) => {
          this.toasterService.error(error.message);
          this.closeModal();
          this.loaderService.setLoading(false);
          this.submitLoading = false;
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.userForm.reset();
  }
  onBack() {
    this.location.back();
  }
}
