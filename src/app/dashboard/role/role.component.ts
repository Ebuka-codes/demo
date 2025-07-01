import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from './shared/role.service';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
@Component({
  selector: 'erecruit-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  userRoleForm!: FormGroup;

  roleData!: any[];

  public closeOnOutsideClick: boolean = false;

  isLoading!: boolean;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private toastService: ToastService,
    private location: Location
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

  ngOnInit(): void {
    this.loadUserRole();
  }
  ngAfterViewInit() {
    this.modalInstance = Modal.getOrCreateInstance(
      this.modalElementRef.nativeElement
    );
    this.modalElementRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        // Ensure the cleanup happens after hide()
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    );
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.resetForm();
    this.isLoading = false;
  }

  closeModal(event: any) {
    if (event) {
      event.preventDefault();
    }
    if (event.type === 'click') {
      if (this.closeOnOutsideClick) {
        this.close();
      } else {
        return;
      }
    }
  }

  loadUserRole() {
    this.roleData = [];
    this.isLoading = true;
    this.roleService.getUserRole().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.roleData = response.data;
        } else {
          this.toastService.error(response.message);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isLoading = false;
      },
    });
  }
  onSubmit() {
    if (this.userRoleForm.valid) {
      this.isLoading = true;
      this.roleService.createUserRole(this.userRoleForm.value).subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.toastService.success(response.message);
            this.loadUserRole();
            this.close();
          } else {
            this.toastService.error(response.message);
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isLoading = false;
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
