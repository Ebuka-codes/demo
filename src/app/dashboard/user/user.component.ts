import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  userForm: FormGroup;
  isLoading$!: Observable<boolean>;
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
    this.isLoading$ = this.loaderService.isLoading$;
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
    this.userService.getUserRole().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userRoleData = response.data;
        } else {
          this.toasterService.error(response.message);
        }
      },
      error: (error) => {
        this.toasterService.error(error.message);
      },
    });

    this.loadUsers();
  }
  loadUsers(): void {
    this.userData = [];
    this.loaderService.setLoading(true);
    this.userService
      .getAllUsers()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.userData = response.data;
          } else {
            this.toasterService.error(response.message);
          }
        },
        error: (error: any) => {
          this.toasterService.error(error.message);
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
  onSubmit() {
    if (this.userForm.valid) {
      this.submitLoading = true;
      this.userService
        .createUser(this.userForm.value)
        .pipe(finalize(() => (this.submitLoading = false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.toasterService.success('User created successfully');
              this.closeModal();
              this.loadUsers();
            } else {
              this.closeModal();
              this.toasterService.error(response.message);
            }
          },
          error: (error) => {
            this.toasterService.error(error.message);
            this.closeModal();
          },
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.userForm.reset();
  }
  onNavigateBack() {
    this.location.back();
  }
}
