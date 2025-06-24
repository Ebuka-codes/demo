import { NgModule } from '@angular/core';
import { UserCreateModalComponent } from './components/user-create-modal/user-create-modal.component';
import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal.component';
import { UserDeleteModalComponent } from './components/user-delete-modal/user-delete-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    UserCreateModalComponent,
    UserEditModalComponent,
    UserDeleteModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
  ],
  providers: [],
})
export class UsersModule {}
