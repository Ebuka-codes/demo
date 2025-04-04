import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../shared/service/loader.service';
import { DashboardService } from './dashboard.service';
import { ToastService } from '../shared/service/toast.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isLoading$!: Observable<boolean>;
  constructor(
    private loaderService: LoaderService,
    private dashboardService: DashboardService,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.dashboardService.loadUserProfile().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.dashboardService.setUserProfile(response.data);
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
      },
    });
  }
}
