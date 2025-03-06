import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
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
import { SidebarComponent } from './components/ui/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { ComfirmDeleteModalComponent } from './components/ui/comfirm-delete-modal/comfirm-delete-modal.component';
import { CorporateComponent } from './corporate/corporate.component';
import { CandidateComponent } from './candidate/candidate.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { ViewCandidateModalComponent } from './components/ui/view-candidate-modal/view-candidate-modal.component';
import { CreateCorporateComponent } from './create-corporate/create-corporate.component';
import { CorporateListComponent } from './corporate-list/corporate-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ComfirmDeleteModalComponent,
    CorporateComponent,
    CandidateComponent,
    CreateJobComponent,
    ViewCandidateModalComponent,
    CreateCorporateComponent,
    CorporateListComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    HttpClientModule,
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
  ],
})
export class DashboardModule {}
