import { Component, Input } from '@angular/core';
import { DashboardStats } from '../../admin-dashboard/shared/dashboardStats';

@Component({
  selector: 'erecruit-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent {
  tableSize: number[] = [10, 15, 20, 25];
  items: any[] = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  @Input() data!: DashboardStats;

  ngOnInit(): void {}
  onTableSizeChange(event: any) {}
  onTableDataChange(event: any) {}
}
