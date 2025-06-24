import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ComfirmDeleteModalComponent } from './components/ui/comfirm-delete-modal/comfirm-delete-modal.component';
import { CorporateModule } from './corporate/corporate.module';
import { CandidateModule } from './candidate/candidate.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StatsComponent } from './components/stats/stats.component';
import { JobListingComponent } from './components/job-listing/job-listing.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { RoleComponent } from './role/role.component';
import { SessionComponent } from './components/ui/session/session.component';
import { UserCorporateComponent } from './user-corporate/user-corporate.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ComfirmDeleteModalComponent,
    AdminDashboardComponent,
    StatsComponent,
    JobListingComponent,
    InterviewsComponent,
    InterviewerComponent,
    RoleComponent,
    SessionComponent,
    UserCorporateComponent,
    DashboardLayoutComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatStepperModule,
    MatSnackBarModule,
    MatIconModule,
    QuillModule.forRoot(),
    NgbModule,
    DashboardRoutingModule,
    CommonModule,
    CandidateModule,
    CorporateModule,
    UsersModule,
    ProfileModule,
    NgxPaginationModule,
  ],
})
export class DashboardModule {}
