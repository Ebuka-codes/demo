import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { CorporateService } from '../../corporate/shared/corporate.service';
import { CORP_URL } from 'src/app/core/model/credential';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'erecruit-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  isLoading!: boolean;
  progress = 0;
  private sub: Subscription | null = null;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private corporateService: CorporateService,
    private toastService: ToastService
  ) {
    this.loaderService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
      if (loading) {
        this.startProgress();
      } else {
        this.completeProgress();
      }
    });
  }
  startProgress() {
    this.progress = 0;
    this.sub = interval(200).subscribe(() => {
      if (this.progress < 90) {
        this.progress += Math.random() * 10;
      }
    });
  }

  completeProgress() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.progress = 100;
    setTimeout(() => {
      this.progress = 0;
    }, 500);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
  ngOnInit() {
    this.authService.loadUserProfile().subscribe();
    this.loadEncodeUrl();
  }
  loadEncodeUrl() {
    this.corporateService.generateEndcodeUrl().subscribe({
      next: (response) => {
        if (response.valid) {
          localStorage.setItem(CORP_URL, response.data);
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
