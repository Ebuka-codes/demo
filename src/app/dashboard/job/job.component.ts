import { Component, OnInit } from '@angular/core';
import { job } from './shared/job';
import { JobService } from './shared/job.service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  switchMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobData!: Array<job>;
  isLoading$!: Observable<any>;
  searchText = new FormControl();
  corpKey!: string | null;
  viewJobData!: Array<job>;
  jobId!: string;
  jobSearch!: string;
  searchLoading = false;
  filteredData!: Array<job>;
  loadingData!: boolean;

  constructor(
    public jobService: JobService,
    private loaderService: LoaderService,
    private route: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAllJob();
    this.corpKey = localStorage.getItem('corp-key');
  }

  getAllJob() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.jobService.getAllJobs().subscribe({
      next: (reponse: any) => {
        if (reponse.valid && reponse.data) {
          this.jobData = reponse.data.sort((a: any, b: any) =>
            a.jobTitle.localeCompare(b.jobTitle)
          );
          this.loaderService.setLoading(false);

          this.filteredData = this.jobData;
        }
      },
      error: (error) => {
        console.log('Error: ', error);
        this.loaderService.setLoading(false);
        this.jobData = [];
      },
    });
  }
  handleSearch() {
    this.searchLoading = true;
    if (this.searchText.value) {
      this.searchText.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((value) => {
            if (value && value.trim() !== '') {
              return this.jobService.searchjob(value.trim());
            } else {
              return this.jobService.getAllJobs();
            }
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.jobData = response.data;
              this.searchLoading = false;
            } else {
              this.jobData = [];
            }
          },
          error: () => {
            console.log('Error: No Jobs Found');
            this.searchLoading = false;
          },
        });
    } else {
      this.searchLoading = false;
    }
  }
  openFilterModal() {
    const modal = Modal.getInstance(
      (document.querySelector('#filterJobModal') as HTMLDivElement) ||
        new Modal(document.querySelector('#filterJobModal') as HTMLDivElement)
    );
    modal?.show();
  }
  updateJobData(data: job[]) {
    this.jobData = data;
  }
  handleViewJoDetail(id: string) {
    this.viewJobData = this.jobData.filter((job) => job.id === id);
  }
  handleEditJob(id: string) {
    this.route.navigateByUrl(`/dashboard/job/edit/${id}`, { replaceUrl: true });
  }
  handleDeleteJob(id: string) {
    this.jobId = id;
  }

  onBack() {
    this.location.back();
  }
}
