import { Component } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  isLoading$!: Observable<boolean>;
  isLoading = false;
  progress = 0;
  private sub: Subscription | null = null;

  constructor(
    private loaderService: LoaderService,
    private userService: UserService,
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
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
