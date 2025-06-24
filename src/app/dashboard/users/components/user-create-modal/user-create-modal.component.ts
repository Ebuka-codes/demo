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
  selector: 'erecruit-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.scss'],
})
export class UserCreateModalComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Output() userUpdate: EventEmitter<any> = new EventEmitter();

  public closeOnOutsideClick: boolean = false;

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
    this.submitLoading = false;
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

  onSubmit() {
    if (this.userForm.valid) {
      this.submitLoading = true;
      this.userService.createUser(this.userForm.value).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.toasterService.success('User created successfully');
            this.userUpdate.emit();
            this.close();
          } else {
            this.toasterService.error(response.message);
            this.submitLoading = false;
          }
        },
        error: (error) => {
          this.toasterService.error(error.message);
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
}
