import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { UserProfile, UserToken } from 'src/app/core/model/credential';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenService } from 'src/app/core/service/token.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isJobActive: boolean = false;
  isProfileActive: boolean = false;
  profile$ = this.authService.profile$;
  loading$ = this.authService.loading$;

  isLoading = true;
  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private tokenService: TokenService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isJobActive = this.route.url.startsWith('/job');
        this.isProfileActive = this.route.url.startsWith('/profile');
        this.cdr.detectChanges();
      });
  }

  onLogout() {
    const token: UserToken = JSON.parse(this.tokenService.getToken() || '{}');
    const refreshToken = token.refresh_token?.toString();
    this.loaderService.setLoading(true);
    this.authService.logout(refreshToken).subscribe((response: any) => {
      if (response.valid) {
        this.tokenService.removeToken();
        this.loaderService.setLoading(false);
        this.route.navigate(['/login']);
      } else {
        this.loaderService.setLoading(false);
        this.toastService.error(response.message);
      }
    });
  }
}
