import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { UtilService } from 'src/app/core/service/util.service';
import { CoreService } from 'src/app/core/service/core.service';
import { Router } from '@angular/router';
import { ApplicationContext } from 'src/app/core/context/application-context';
import { CORP_URL_KEY } from 'src/app/shared/model/credential';

@Component({
  selector: 'erecruit-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  isLoading: boolean = false;
  customLoaderBg = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private utilService: UtilService,
    private coreService: CoreService,
    private router: Router,
    private applicationContext: ApplicationContext
  ) {}
  ngOnInit() {
    this.handleTokenExpiration();
    this.loadEncodeUrl();

    console.log('working');
  }

  handleTokenExpiration() {
    this.utilService.getTokenExpireSession().subscribe((response) => {
      if (response.error) {
        console.log('TOKEN EXPIRE');
        console.log('Log out successfully');
        this.coreService.removeSessionKey();
        if (response.errorCode === 'INVALID_SESSION') {
          this.toastService.error('Session no longer valid');
          this.logout('/session-expired');
        }
      } else {
        this.logout();
      }
    });
  }
  private logout(url?: string) {
    if (this.applicationContext.isLoggedIn) {
      this.router.navigate([url || '/login']);
    }
    this.coreService.logout();
  }
  loadEncodeUrl() {
    this.utilService.generateEndcodeUrl().subscribe({
      next: (response) => {
        if (response.valid) {
          localStorage.setItem(CORP_URL_KEY, response.data);
        } else {
          this.toastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
      },
    });
  }
}
