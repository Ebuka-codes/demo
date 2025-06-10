import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { PersonalProfileComponent } from './components/personal-profile/personal-profile.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { EmailSetupComponent } from './components/email-setup/email-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', component: PersonalProfileComponent },
      { path: 'company', component: CompanyProfileComponent },
      { path: 'email-setup', component: EmailSetupComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
