import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { job } from 'src/app/shared/type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'erecruit-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnInit {
  PORT_URL = environment.PORT_URL;
  jobList: Array<job> = [];
  jobSearchFilterData: any[] = [];
  jobType!: any[];
  jobLocation!: any[];
  isLoadingData$!: Observable<boolean>;
  isLoadingSearch!: boolean;
  error$!: Observable<any>;
  searchValue: string = '';
  selectedJobTypes: string[] = [];
  minData: number = 0;
  maxData: number = 8;
  jobTypeCounter!: any[];
  encodeUrl!: string;
  errorMessage!: boolean;
  jobUrl = `${this.PORT_URL}/apply/`;

  constructor(
    private jobService: JobRecruitService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.isLoadingData$ = this.jobService.isLoading$;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.encodeUrl = params['corpUrl'];
      if (this.encodeUrl) {
        this.jobService.setCorpUrl(this.encodeUrl);
        this.loadJobListing();
      }
    });
  }
  loadJobListing() {
    this.jobService.setLoading(true);
    this.jobService
      .getJobList()
      .pipe(finalize(() => this.jobService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.jobList = response.data;
            this.jobSearchFilterData = response.data;
            this.jobType = Array.from(
              new Set(
                this.jobList
                  ?.filter((job: any) => job.jobType)
                  .map((job: any) => job.jobType)
              )
            );
            this.jobLocation = Array.from(
              new Set(
                this.jobList
                  ?.filter((job: any) => job.jobLocation)
                  .map((job: any) => job.jobLocation)
              )
            );
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
  searchJob() {
    this.onSearchInput(this.searchValue);
  }
  onSearchEnter(value: any) {
    this.searchValue = value;
    this.onSearchInput(this.searchValue);
  }
  onSearchInput(value: any) {
    this.searchValue = value;
    this.isLoadingSearch = true;
    this.jobService.searchJobs(this.searchValue.trim()).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.jobSearchFilterData = response.data;
          this.isLoadingSearch = false;
        } else {
          this.jobList = [];
          this.isLoadingSearch = false;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }
  onFilterChange(selectedJobTypes: string[]) {
    this.isLoadingSearch = true;
    if (selectedJobTypes.length === 0) {
      this.jobService.getJobList().subscribe((response) => {
        this.jobList = response.data;
        this.isLoadingSearch = false;
      });
      return;
    }
    this.jobService.filterJobs(selectedJobTypes).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.jobSearchFilterData = response.data;
          this.isLoadingSearch = false;
        } else {
          this.toastService.error('No Jobs Found');
          this.jobList = [];
          this.isLoadingSearch = false;
        }
      },
      error: (err) => {
        this.toastService.error(err.message);
      },
    });
  }
  toggleJobType(type: string) {
    const index = this.selectedJobTypes.indexOf(type);
    if (index !== -1) {
      this.selectedJobTypes.splice(index, 1);
      this.jobTypeCounter = this.selectedJobTypes;
    } else {
      this.selectedJobTypes.push(type);
      this.jobTypeCounter = this.selectedJobTypes;
    }
    this.onFilterChange([...this.selectedJobTypes]);
  }
  onClearSearchFilter() {
    this.isLoadingSearch = true;
    this.selectedJobTypes = [];
    this.jobService
      .searchJobs(this.searchValue.trim())
      .subscribe((response) => {
        if (response.valid && response.data) {
          this.jobSearchFilterData = response.data;
          this.isLoadingSearch = false;
        } else {
          this.toastService.error('No Jobs Found');
          this.jobList = [];
        }
      });
  }
  showJobList() {
    this.maxData = this.maxData += 8;
  }
}
