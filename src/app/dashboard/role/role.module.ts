import { NgModule } from '@angular/core';
import { RoleComponent } from './role.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoleComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class RoleModule {}
