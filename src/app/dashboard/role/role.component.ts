import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from './shared/role.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'erecruit-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  userRoleForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  roleData!: any[];
  submitLoading!: boolean;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private location: Location
  ) {
    this.userRoleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
    });
    this.isLoading$ = this.loaderService.isLoading$;
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

  ngOnInit(): void {
    this.loadUserRole();
  }
  loadUserRole() {
    this.roleData = [];
    this.loaderService.setLoading(true);
    this.roleService
      .getUserRole()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.roleData = response.data;
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.loaderService.setLoading(false);
          this.toastService.error(error.message);
        },
      });
  }
  onSubmit() {
    if (this.userRoleForm.valid) {
      this.submitLoading = true;
      this.roleService
        .createUserRole(this.userRoleForm.value)
        .pipe(finalize(() => (this.submitLoading = false)))
        .subscribe({
          next: (response: any) => {
            if (response.valid) {
              this.toastService.success(response.message);
              this.closeModal();
              this.loadUserRole();
            } else {
              this.toastService.error(response.message);
              this.closeModal();
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
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
  onBack() {
    this.location.back();
  }
}
