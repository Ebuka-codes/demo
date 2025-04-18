import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { UserProfile } from 'src/app/core/model/credential';
import { DashboardService } from '../dashboard.service';
import { DashboardStats } from './shared/dashboardStats';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  userProfile!: UserProfile;
  isLoading$!: Observable<boolean>;
  data!: DashboardStats;

  constructor(
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private userService: UserService,
    private dashboardService: DashboardService
  ) {}
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user: any) => {
      if (user) {
        this.userProfile = user;
        this.cdr.detectChanges();
      } else {
      }
    });
    this.loadDashboard();
  }

  loadUserProfile() {
    return this.userService.getUserProfile();
  }
  loadDashboard() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      if (data) {
        this.data = data;
        setTimeout(() => {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
        }, 2000);
      } else {
        setTimeout(() => {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
        }, 1000);
      }
    });
  }
}
