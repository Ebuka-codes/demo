import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { AuthService } from 'src/app/core/service/auth.service';

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
    private authService: AuthService
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
  }
}
