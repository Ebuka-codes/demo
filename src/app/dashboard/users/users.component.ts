import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { UserService } from './shared/user.service';
import { UserCreateModalComponent } from './components/user-create-modal/user-create-modal.component';

@Component({
  selector: 'erecruit-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  @ViewChild(UserCreateModalComponent)
  UserCreateModalComponent!: UserCreateModalComponent;
  modalInstance!: Modal;
  isLoading!: boolean;
  userRoleData!: any[];
  userData!: any[];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toasterService: ToastService,
    private location: Location
  ) {}

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

  openModal() {
    this.UserCreateModalComponent.open();
  }
  loadUsers(): void {
    this.userData = [];
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userData = response.data;
        } else {
          this.toasterService.error(response.message);
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      },
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
