import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { UserCorporateComponent } from './user-corporate/user-corporate.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SvgModule } from '../shared/components/svg/svg.module';
import { InterviewerModule } from './interviewer/interviewer.module';
import { RoleModule } from './role/role.module';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {
  ApplicationContextFactory,
  CoreService,
} from '../core/service/core.service';

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
    InterviewerModule,
    RoleModule,
    NgxPaginationModule,
    SvgModule,
    LoadingBarHttpClientModule,
  ],
  providers: [
    CoreService,
    {
      provide: APP_INITIALIZER,
      useFactory: ApplicationContextFactory,
      deps: [CoreService],
      multi: true,
    },
  ],
})
export class DashboardModule {}
