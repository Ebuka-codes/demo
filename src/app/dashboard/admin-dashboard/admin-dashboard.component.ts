import { ChangeDetectorRef, Component } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { DashboardService } from '../dashboard.service';
import { DashboardStats } from './shared/dashboardStats';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  profile$ = this.authService.profile$;
  isLoading!: boolean;
  data!: DashboardStats;

  constructor(
    private loaderService: LoaderService,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard() {
    this.isLoading = true;
    this.loaderService.setLoading(true);
    this.dashboardService
      .getDashboardData()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loaderService.setLoading(false);
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.data = response;
          } else {
            this.toastService.error('Error occur');
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
}
