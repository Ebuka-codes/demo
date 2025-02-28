import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { JobListingComponent } from './components/job-listing/job-listing.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobCategoryComponent } from './components/job-category/job-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { LoaderSpinnerComponent } from './components/loader-spinner/loader-spinner.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HomeComponent } from './pages/home/home.component';
import { ViewJobDetailsComponent } from './pages/view-job-details/view-job-details.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { ApplyComponent } from './components/apply/apply.component';
import { LoginComponent } from './authentication/login/login.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateJobComponent } from './pages/create-job/create-job.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { CorporateComponent } from './pages/corporate/corporate.component';

@NgModule({
  declarations: [
    AppComponent,
    JobDetailsComponent,
    JobCategoryComponent,
    CreateJobComponent,
    LoaderSpinnerComponent,
    HomeComponent,
    ViewJobDetailsComponent,
    NotFoundErrorComponent,
    ApplyComponent,
    LoginComponent,
    HeaderComponent,
    JobListingComponent,
    JobCategoryComponent,
    CorporateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
