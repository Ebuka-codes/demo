import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { CORP_URL_KEY } from 'src/app/core/model/credential';
import { ToastService } from 'src/app/core/service/toast.service';
import { UtilService } from 'src/app/core/service/util.service';
import { job } from 'src/app/dashboard/job/shared/job';
import { SvgTemplate } from 'src/app/shared/components/svg/svg-template';
import { KeyValuePair } from 'src/app/shared/model/job-model';
import {
  FilterOption,
  PagingConfig,
  PostedDateOption,
  QueryOption,
} from 'src/app/shared/model/model';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'erecruit-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnInit {
  svgTemplate = SvgTemplate;
  allJobs: Array<job> = [];
  displayedJobs: Array<job> = [];
  jobSearchFilterData: any[] = [];
  jobType!: Array<QueryOption>;
  jobLocation!: Array<QueryOption>;
  isLoadingData$!: Observable<boolean>;
  isSearchLoading!: boolean;
  isFilterLoading!: boolean;
  searchValue: string = '';
  corpUrl!: string;
  pagingConfig: PagingConfig = {} as PagingConfig;
  postedDateOption!: Array<PostedDateOption>;
  isPaginationLoading: boolean = false;
  filters: any = new Object();
  isFilterEmpty!: boolean;
  selectedJobType = 'Job Type';
  selectedWorkMode = 'Work Mode';
  selectedLocation = 'Location';
  selectedPostedDate = 'Posted Date';
  isSearch!: boolean;
  totalJob!: any[];
  workmode = new Array<KeyValuePair>(
    {
      key: 'HYBRID',
      value: 'Hybrid',
    },
    { key: 'REMOTE', value: 'Remote' },
    { key: 'ON_SITE', value: 'On-site' }
  );

  [key: string]: any;

  constructor(
    private jobService: JobRecruitService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {
    this.isLoadingData$ = this.jobService.isLoading$;
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.corpUrl = params['corpUrl'];
      if (this.corpUrl) {
        localStorage.setItem(CORP_URL_KEY, this.corpUrl);
        this.loadPostedDate();
        this.loadQuery();
        this.loadJobListing(0, 10);
      }
    });
    this.pagingConfig = {
      currentPage: 1,
      totalItems: 20,
      itemsPerPage: 5,
    };
    this.jobService.setLoading(true);
    this.isFilterEmpty = Object.keys(this.filters).length === 0;
  }
  loadJobListing(page: number, size: number) {
    this.jobService
      .getJobList(page, size)
      .pipe(
        finalize(() => {
          this.jobService.setLoading(false);
          this.isPaginationLoading = false;
          this.isFilterLoading = false;
          window.scrollTo({ top: 0, behavior: 'instant' });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.allJobs = response.data.content;
            this.displayedJobs = response.data.content;
            this.pagingConfig = {
              itemsPerPage: size,
              currentPage: response.data.pageable.pageNumber + 1,
              totalItems: response.data.totalElements,
            };
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }

  loadPostedDate() {
    this.jobService.getPostedDate().subscribe((response: any) => {
      if (response) {
        this.postedDateOption = response;
      } else {
        this.toastService.error(response.message);
        this.jobService.setLoading(false);
      }
    });
  }
  loadQuery() {
    this.jobService.getQuery().subscribe((response: any) => {
      if (response) {
        this.totalJob = response.data;
        const query = response.data;
        this.jobType = Array.from(
          new Set(query?.filter((job: any) => job.type === 'jobType'))
        );
        this.jobLocation = Array.from(
          new Set(query?.filter((job: any) => job.type === 'jobLocation'))
        );
      } else {
        this.toastService.error(response.message);
        this.jobService.setLoading(false);
      }
    });
  }

  searchJob() {
    if (this.searchValue) {
      this.onSearchInput(this.searchValue.trim(), 0, 2, true);
      this.isSearch = true;
    }
  }
  onSearchEnter(value: any) {
    this.searchValue = value.trim();
    this.onSearchInput(this.searchValue, 0, 10, true);
    this.isSearch = true;
  }

  onSearchInput(value: any, page: number, size: number, isLoading: boolean) {
    this.isSearchLoading = isLoading;
    this.jobService
      .searchJobs(value.trim(), page, size)
      .pipe(
        finalize(() => {
          this.isPaginationLoading = false;
          this.isSearchLoading = false;
          window.scrollTo({ top: 0, behavior: 'instant' });
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.displayedJobs = response.data.content;
            this.pagingConfig = {
              itemsPerPage: size,
              currentPage: response.data.pageable.pageNumber + 1,
              totalItems: response.data.totalElements,
            };
          } else {
            this.displayedJobs = [];
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }

  setFilter(value: string, labelProp: string, type: string) {
    this.filters[type] = value;
    this[labelProp] = this.utilService.capitalizeFirstLetter(
      value.toLowerCase().replaceAll('_', ' ')
    );
    this.isFilterEmpty = false;
    this.onFilterChange(this.filters, 0, 10, true);
  }
  onFilterChange(
    data: FilterOption,
    page: number,
    size: number,
    isLoading: boolean
  ) {
    this.isFilterLoading = isLoading;
    this.jobService
      .filterJobs(data, page, size)
      .pipe(
        finalize(() => {
          this.isPaginationLoading = false;
          this.isFilterLoading = false;
          window.scrollTo({ top: 0, behavior: 'instant' });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.displayedJobs = response.data.content;
            this.pagingConfig = {
              itemsPerPage: size,
              currentPage: response.data.pageable.pageNumber + 1,
              totalItems: response.data.totalElements,
            };
          } else {
            this.toastService.error(response.message);
            this.displayedJobs = [];
          }
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      });
  }

  removeFiter(field: string, labelProp: string, defaultLabel: string) {
    delete this.filters[field];
    this[labelProp] = defaultLabel;
    this.onFilterChange(this.filters, 0, 10, true);

    if (Object.keys(this.filters).length === 0) {
      this.isFilterEmpty = true;
    }
  }
  clearAllFilter() {
    this.isFilterLoading = true;
    this.isFilterEmpty = true;
    this.jobService
      .getJobList(0, 10)
      .pipe(
        finalize(() => {
          this.isFilterLoading = false;
        })
      )
      .subscribe(
        (response) => {
          if (response.valid && response.data) {
            this.displayedJobs = response.data.content;
            this.filters = {};
            this.selectedJobType = 'Job Type';
            this.selectedWorkMode = 'Work Mode';
            this.selectedLocation = 'Location';
            this.selectedPostedDate = 'Posted Date';
          } else {
            this.toastService.error(response.message);
          }
        },
        (error) => this.toastService.error(error.message)
      );
  }

  onTogglePage(event: any) {
    this.isPaginationLoading = true;

    this.pagingConfig.currentPage = event;

    const page = this.pagingConfig.currentPage - 1;

    const size = this.pagingConfig.itemsPerPage;

    if (this.isSearch && (this.searchValue.trim() || this.searchValue === '')) {
      this.onSearchInput(this.searchValue, page, size, false);
    } else if (Object.keys(this.filters).length > 0) {
      this.onFilterChange(this.filters, page, size, false);
    } else {
      this.loadJobListing(page, size);
    }
  }
}
