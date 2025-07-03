import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationContext } from 'src/app/core/context/application-context';
import { UserProfile } from 'src/app/shared/model/credential';

@Component({
  selector: 'erecruit-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userProfile: UserProfile;
  isLoading$!: Observable<boolean>;
  constructor(private applicationContext: ApplicationContext) {}
  ngOnInit(): void {
    this.applicationContext.onUserProfile((UserProfile: any) => {
      this.userProfile = UserProfile.data;
    });
  }
}
