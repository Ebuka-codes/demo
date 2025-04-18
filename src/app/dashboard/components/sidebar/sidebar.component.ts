import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserProfile, UserToken } from 'src/app/core/model/credential';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenService } from 'src/app/core/service/token.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { UserService } from '../../user/user.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isJobActive: boolean = false;
  userProfile!: UserProfile;
  isLoading = true;
  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private tokenService: TokenService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private userService: UserService
  ) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isJobActive = this.route.url.startsWith('/job');
        this.cdr.detectChanges();
      });
    this.isLoading = true;
    this.userService.getUserProfile().subscribe((user) => {
      if (user) {
        this.userProfile = user;
        this.cdr.detectChanges();
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.userService.loadUserProfile().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userService.setUserProfile(response.data);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
      },
    });
  }

  onLogout() {
    const token: UserToken = JSON.parse(this.tokenService.getToken() || '{}');
    const refreshToken = token.refresh_token?.toString();
    this.loaderService.setLoading(true);
    this.authService.logout(refreshToken).subscribe((response: any) => {
      if (response.valid) {
        console.log('Log out successful');
        this.tokenService.removeToken();
        this.loaderService.setLoading(false);
        this.route.navigate(['/login']);
        setTimeout(() => {}, 3000);
      } else {
        this.loaderService.setLoading(false);
        this.toastService.error(response.message);
      }
    });
  }
}
