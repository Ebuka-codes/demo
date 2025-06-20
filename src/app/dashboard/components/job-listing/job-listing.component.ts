import { Component, Input } from '@angular/core';
import { DashboardStats } from '../../admin-dashboard/shared/dashboardStats';
import { PagingConfig } from 'src/app/shared/model/pagination-model';

@Component({
  selector: 'erecruit-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent {
  pagingConfig: PagingConfig = {} as PagingConfig;
  tableSize: number[] = [10, 15, 20, 25];
  items: any[] = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  @Input() data!: DashboardStats;

  ngOnInit(): void {
    this.pagingConfig = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 20,
    };
  }
  onTableSizeChange(event: any) {}
  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event;
  }
}
