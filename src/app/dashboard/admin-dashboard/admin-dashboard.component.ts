import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { UserProfile } from 'src/app/authentication/shared/credential';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  userProfile!: UserProfile;
  isLoading$!: Observable<boolean>;
  constructor(
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.dashboardService.setLoading(true);
    this.isLoading$ = this.dashboardService.isLoading$;
    this.userService.getUserProfile().subscribe((user: any) => {
      if (user) {
        this.userProfile = user;
        this.cdr.detectChanges();
        this.dashboardService.setLoading(false);
        this.isLoading$ = this.dashboardService.isLoading$;
      } else {
        // this.dashboardService.setLoading(false);
        // this.isLoading$ = this.dashboardService.isLoading$;
      }
    });
  }
}
