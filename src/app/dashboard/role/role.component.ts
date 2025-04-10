import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from './shared/role.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  userRoleForm!: FormGroup;
  submitLoading!: boolean;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.userRoleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
    });
  }
  get name() {
    return this.userRoleForm.get('name');
  }
  get description() {
    return this.userRoleForm.get('description');
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
    if (this.userRoleForm.valid) {
      this.submitLoading = true;
      this.loaderService.setLoading(true);
      this.roleService.createUserRole(this.userRoleForm.value).subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.loaderService.setLoading(false);
            this.submitLoading = false;
            this.toastService.success(response.message);
            this.closeModal();
          } else {
            this.loaderService.setLoading(false);
            this.submitLoading = false;
            this.toastService.error(response.message);
            this.closeModal();
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.loaderService.setLoading(true);
          this.closeModal();
        },
      });
    } else {
      this.userRoleForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.userRoleForm.reset();
  }
}
