import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { UserService } from '../../shared/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/service/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.scss'],
})
export class UserCreateModalComponent {
  @ViewChild('myModal') modalElement!: ElementRef;
  @Output() userUpdate: EventEmitter<any> = new EventEmitter();
  modalInstance!: Modal;
  submitLoading!: boolean;
  userForm!: FormGroup;
  userRoleData!: any[];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toasterService: ToastService
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

  ngOnInit(): void {
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
              this.userUpdate.emit();
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
}
