import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserProfile } from 'src/app/authentication/shared/credential';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isJobActive: boolean = false;
  userProfile!: UserProfile;
  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isJobActive = this.route.url.startsWith('/dashboard/job');
        this.cdr.detectChanges();
      });

    this.dashboardService.getUserProfile().subscribe((user) => {
      if (user) {
        this.userProfile = user;
        console.log(this.userProfile);
        this.cdr.detectChanges();
      }
    });
  }
}
