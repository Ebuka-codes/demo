import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ApplicationContext } from 'src/app/core/context/application-context';
import { CoreService } from 'src/app/core/service/core.service';
import { UserProfile } from 'src/app/shared/model/credential';

@Component({
  selector: 'erecruit-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isJobActive: boolean = false;
  isProfileActive: boolean = false;
  userProfile: UserProfile;
  loading$ = this.authService.loading$;

  isLoading = true;
  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private coreService: CoreService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private applicationContext: ApplicationContext
  ) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isJobActive = this.route.url.startsWith('/job');
        this.isProfileActive = this.route.url.startsWith('/profile');
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.applicationContext.onUserProfile((userProfile: any) => {
      this.userProfile = userProfile.data;
    });
  }

  onLogout() {
    this.loaderService.setLoading(true);
    this.coreService
      .logoutSession(this.applicationContext.getUserToken().refresh_token)
      .subscribe((response: any) => {
        if (response.valid) {
          this.coreService.removeSessionKey();
          this.route.navigate(['/login']);
        } else {
          this.toastService.error(response.message);
        }
      });
  }
}
