import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { job } from './shared/job';
import { JobService } from './shared/job.service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobData!: Array<job>;
  isLoading$!: Observable<any>;
  searchText = new FormControl('');
  corpKey!: string | null;
  viewJobData!: Array<job>;
  constructor(
    public jobService: JobService,
    private dashboardService: DashboardService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getAllJob();
    this.corpKey = localStorage.getItem('corp-key');
  }
  getAllJob() {
    this.dashboardService.setLoading(true);
    this.isLoading$ = this.dashboardService.isLoading$;
    this.jobService.getAllJobs().subscribe({
      next: (reponse: any) => {
        if (reponse.valid && reponse.data) {
          this.jobData = reponse.data;
          console.log(this.jobData);
          this.dashboardService.setLoading(false);
        }
      },
      error: (error) => {
        console.log('Error: ', error);
        this.dashboardService.setLoading(false);
        this.jobData = [];
      },
    });
  }
  handleSearch() {
    this.dashboardService.setLoading(true);
    this.isLoading$ = this.dashboardService.isLoading$;
    this.searchText.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value) =>
          value ? this.jobService.filterjob(value) : of([])
        )
      )
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.jobData = response.data;
            this.dashboardService.setLoading(false);
          } else {
            this.jobData = [];
          }
        },
        error: () => {
          console.log('Error: No Jobs Found');
          this.dashboardService.setLoading(false);
        },
      });
  }

  handleViewJoDetail(id: string) {
    this.viewJobData = this.jobData.filter((job) => job.id === id);
  }

  handleEditJob(id: string) {
    this.route.navigateByUrl(`/dashboard/job/edit/${id}`, { replaceUrl: true });
  }
}
