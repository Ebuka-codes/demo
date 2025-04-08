import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { months } from 'src/app/shared/constants';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { job } from 'src/app/shared/type';

@Component({
  selector: 'app-home',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnInit {
  jobList!: Array<job>;
  jobSearchFilterData!: any[];
  jobType!: any[];
  jobLocation!: any[];
  // isLoadingSearchFilter$!: Observable<boolean>;
  // isLoadingJobList$!: Observable<boolean>;
  isLoadingData$!: Observable<boolean>;
  isLoadingSearch: boolean = false;
  error$!: Observable<any>;
  searchValue: string = '';
  private notyf = new Notyf();
  selectedJobTypes: string[] = [];
  minData: number = 0;
  maxData: number = 8;
  jobTypeCounter!: any[];

  constructor(
    private jobService: JobRecruitService,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    this.jobService.getJobList().subscribe((data) => {
      this.jobList = data;
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
    });
    this.isLoadingData$ = this.jobService.isLoading$;

    // this.jobService.getJobList().subscribe({
    //   next: (response: any) => {
    //     if (response) {
    //       this.jobList = response.data;
    //       this.jobType = Array.from(
    //         new Set(
    //           this.jobSearchFilterData
    //             ?.filter((job: any) => job.jobType)
    //             .map((job: any) => job.jobType)
    //         )
    //       );
    //       this.jobLocation = Array.from(
    //         new Set(
    //           this.jobSearchFilterData
    //             ?.filter((job: any) => job.jobLocation)
    //             .map((job: any) => job.jobLocation)
    //         )
    //       );
    //       this.jobService.setLoading(false);
    //       this.isLoadingData$ = this.jobService.isLoading$;
    //     }
    //   },
    //   error: (err) => {
    //     this.jobService.setLoading(false);
    //     this.isLoadingData$ = this.jobService.isLoading$;
    //     this.toastService.error(err.message);
    //   },
    // });

    // this.getSearchFilter();
    // this.getJobList();
  }
  // getSearchFilter() {
  //   this.jobService.setLoading(true);
  //   this.isLoadingSearchFilter$ = this.jobService.isLoading$;
  //   this.jobService.getJobList().subscribe({
  //     next: (response: any) => {
  //       if (response.valid && response.data) {
  //         this.jobSearchFilterData = response.data;
  //         this.jobType = Array.from(
  //           new Set(
  //             this.jobSearchFilterData
  //               ?.filter((job: any) => job.jobType)
  //               .map((job: any) => job.jobType)
  //           )
  //         );
  //         this.jobLocation = Array.from(
  //           new Set(
  //             this.jobSearchFilterData
  //               ?.filter((job: any) => job.jobLocation)
  //               .map((job: any) => job.jobLocation)
  //           )
  //         );
  //         this.jobService.setLoading(false);
  //         this.isLoadingSearchFilter$ = this.jobService.isLoading$;
  //       }
  //     },
  //     error: (err) => {
  //       this.jobService.setLoading(false);
  //       this.isLoadingSearchFilter$ = this.jobService.isLoading$;
  //       this.toastService.error(err.message);
  //     },
  //   });
  // }

  // getJobList() {
  //   this.jobService.setLoading(true);
  //   this.isLoadingJobList$ = this.jobService.isLoading$;
  //   this.jobService.getJobList().subscribe({
  //     next: (response: any) => {
  //       if (response.valid && response.data) {
  //         this.jobList = response.data;
  //       }
  //     },
  //     error: (err) => {
  //       this.jobService.setLoading(false);
  //       this.isLoadingJobList$ = this.jobService.isLoading$;
  //       this.toastService.error(err.message);
  //     },
  //   });
  // }
  searchJob() {
    if (this.searchValue) {
      console.log(this.searchValue);
      this.onSearchInput(this.searchValue);
    }
  }
  onSearchEnter(value: any) {
    this.searchValue = value;
    this.onSearchInput(this.searchValue);
  }
  onSearchInput(value: any) {
    this.searchValue = value;
    this.isLoadingSearch = true;

    this.jobService
      .searchJobs(this.searchValue.trim())
      .subscribe((response) => {
        if (response.valid && response.data) {
          this.jobList = response.data;
          this.isLoadingSearch = false;
        } else {
          this.toastService.error('No Jobs Found');
          this.jobList = [];
        }
      });
  }
  onFilterChange(selectedJobTypes: string[]) {
    this.isLoadingSearch = true;
    if (selectedJobTypes.length === 0) {
      this.jobService.getJobList().subscribe((data) => {
        this.jobList = data;
        this.isLoadingSearch = false;
      });
      return;
    }
    this.jobService.filterJobs(selectedJobTypes).subscribe((response) => {
      if (response.valid && response.data) {
        this.jobList = response.data;
        this.isLoadingSearch = false;
      } else {
        this.notyf.error('No Jobs Found');
        this.jobList = [];
        this.isLoadingSearch = false;
      }
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
          this.jobList = response.data;
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

  formatDate(value: string) {
    const date = new Date(value);
    return `${date.getDate()} ${
      months[date.getMonth() + 1]
    } ${date.getFullYear()}`;
  }
}
