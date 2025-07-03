import { Component } from '@angular/core';
import { ApplicationContext } from 'src/app/core/context/application-context';
import { UserProfile } from 'src/app/shared/model/credential';

@Component({
  selector: 'erecruit-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss'],
})
export class PersonalProfileComponent {
  userProfile: UserProfile;
  constructor(private applicationContext: ApplicationContext) {
    this.applicationContext.onUserProfile((UserProfile: any) => {
      this.userProfile = UserProfile.data;
    });
  }
}
