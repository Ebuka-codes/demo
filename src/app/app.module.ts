import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { JobListingComponent } from './components/job-listing/job-listing.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobCategoryComponent } from './components/job-category/job-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    JobListingComponent,
    JobDetailsComponent,
    JobCategoryComponent,
    CreateJobComponent,
    LoaderSpinnerComponent,
    HomeComponent,
    ViewJobDetailsComponent,
    NotFoundErrorComponent,
    ApplyComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatStepperModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
