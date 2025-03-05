import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderSpinnerComponent } from './ui/loader-spinner/loader-spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { LoginComponent } from './pages/authentication/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoaderSpinnerComponent,
    ApplyComponent,
    JobDetailsComponent,
    LoginComponent,
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
    MatStepperModule,
    FormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
