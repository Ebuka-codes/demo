import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { job } from './shared/job';
import { JobService } from './shared/job.service';
import { finalize } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from 'src/app/core/service/toast.service';
import { environment } from 'src/environments/environment';
import { JobDeleteModalComponent } from './components/job-delete-modal/job-delete-modal.component';
import { JobFilterModalComponent } from './components/job-filter-modal/job-filter-modal.component';
import { JobViewModalComponent } from './components/job-view-modal/job-view-modal.component';

@Component({
  selector: 'erecruit-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  @ViewChild(JobDeleteModalComponent)
  JobDeleteModalComponent!: JobDeleteModalComponent;

  @ViewChild(JobFilterModalComponent)
  JobFilterModalComponent!: JobFilterModalComponent;

  @ViewChild(JobViewModalComponent)
  JobViewModalComponent!: JobViewModalComponent;

  PORT_URL = environment.PORT_URL;
  jobData: Array<job> = [];
  isLoading!: boolean;
  searchText = new FormControl();
  viewJobData!: Array<job>;
  jobId!: string;
  jobSearch!: string;
  searchLoading = false;
  filteredData!: Array<job>;
  loadingData!: boolean;
  jobUrl: string = `${environment.PORT_URL}/apply`;
  jobListingUrl!: string;
  tabs: string[] = ['All Jobs', 'Active Job', 'Published Job'];
  activeTag = 'All Jobs';
  selectedAllChecked: boolean = false;
  selectedJobId: string[] = [];
  encodeUrl!: string;
  constructor(
    public jobService: JobService,
    private route: Router,
    private location: Location,
    private clipboard: Clipboard,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.encodeUrl = localStorage.getItem('corp-url') || '';

    if (this.encodeUrl) {
      this.jobListingUrl = `${this.PORT_URL}/job-listing/${this.encodeUrl}`;
    }
  }
  onToggletabs(tab: string) {
    this.activeTag = tab;
    switch (this.activeTag) {
      case 'All Jobs':
        this.loadJobs();
        break;

      case 'Active Job':
        this.loadActiveJobs();
        break;

      case 'Published Job':
        this.loadPublishedJobs();
        break;
    }
  }
  onToggleAllCheckbox() {
    this.selectedAllChecked = !this.selectedAllChecked;
    if (this.selectedAllChecked) {
      this.selectedJobId = this.filteredData.map((item) => item.id);
    } else {
      this.selectedJobId = [];
    }
  }

  onToggleSelection(id: string) {
    if (this.selectedJobId.includes(id)) {
      this.selectedJobId = this.selectedJobId.filter((itemId) => itemId !== id);
    } else {
      this.selectedJobId.push(id);
    }
    this.selectedAllChecked =
      this.selectedJobId.length === this.filteredData.length;
  }
  loadJobs() {
    this.isLoading = true;
    this.jobService
      .getAllJobs()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (reponse: any) => {
          if (reponse.valid && reponse.data) {
            this.jobData = reponse.data.sort((a: any, b: any) =>
              a.jobTitle.localeCompare(b.jobTitle)
            );

            this.filteredData = this.jobData;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.jobData = [];
          this.toastService.error(error.message);
        },
      });
  }

  loadActiveJobs() {
    this.isLoading = true;
    this.jobData = [];
    this.jobService
      .getActiveJobs()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (reponse: any) => {
          if (reponse.valid && reponse.data) {
            this.jobData = reponse.data.sort((a: any, b: any) =>
              a.jobTitle.localeCompare(b.jobTitle)
            );
            this.filteredData = this.jobData;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.jobData = [];
          this.toastService.error(error.message);
        },
      });
  }

  loadPublishedJobs() {
    this.isLoading = true;
    this.jobData = [];
    this.jobService
      .getPublishJobs()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (reponse: any) => {
          if (reponse.valid && reponse.data) {
            this.jobData = reponse.data.sort((a: any, b: any) =>
              a.jobTitle.localeCompare(b.jobTitle)
            );

            this.filteredData = this.jobData;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.jobData = [];
          this.toastService.error(error.message);
        },
      });
  }

  onPublishJobs() {
    if (this.selectedJobId.length) {
      const payload = {
        ids: this.selectedJobId,
      };

      this.jobService.publishJobs(payload).subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.toastService.success(response.message);
            this.cdr.detectChanges();
            this.selectedJobId = [];
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
    } else {
      this.toastService.error(
        'Please select at least one job before publishing'
      );
    }
  }

  handleSearch(event: Event) {
    const value = event as KeyboardEvent;
    if (value.key === 'Enter' && this.searchText.value) {
      this.jobService.searchjob(this.searchText.value.trim()).subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.jobData = response.data;
          } else {
            this.jobData = [];
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
    }
  }

  onClearSearch() {
    if (this.searchText.value === '') {
      this.loadJobs();
    } else {
      this.searchText.reset();
      this.loadJobs();
    }
  }

  openFilterModal() {
    this.JobFilterModalComponent.open();
  }
  updateJobData(data: job[]) {
    this.jobData = data;
  }
  handleViewJoDetail(id: string) {
    this.viewJobData = this.jobData.filter((job) => job.id === id);
    this.JobViewModalComponent.open();
  }
  handleEditJob(id: string) {
    this.route.navigateByUrl(`/job/edit/${id}`, { replaceUrl: true });
  }
  handleDeleteJob(id: string) {
    this.jobId = id;
    this.JobDeleteModalComponent.open();
  }

  onBack() {
    this.location.back();
  }
  onCopyUrl(id: string) {
    this.clipboard.copy(
      `${this.PORT_URL}/apply/${id}/overview/${this.encodeUrl}`
    );
  }
}
