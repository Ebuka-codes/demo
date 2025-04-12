import { Component, Input } from '@angular/core';
import { DashboardStats } from '../../admin-dashboard/shared/dashboardStats';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent {
  @Input() data!: DashboardStats;
}
