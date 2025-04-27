import { NgModule } from '@angular/core';
import { PersonalProfileComponent } from './components/personal-profile/personal-profile.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { EmailSetupComponent } from './components/email-setup/email-setup.component';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [
    ProfileComponent,
    PersonalProfileComponent,
    CompanyProfileComponent,
    EmailSetupComponent,
  ],
  imports: [CommonModule, RouterModule, ProfileRoutingModule],
  providers: [],
})
export class ProfileModule {}
