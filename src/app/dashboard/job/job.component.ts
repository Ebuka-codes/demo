import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { enviroments } from 'src/environments/enviorments';
import { CORP_KEY } from 'src/app/core/model/credential';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobData!: Array<job>;
  isLoading$!: Observable<any>;
  searchText = new FormControl();
  viewJobData!: Array<job>;
  jobId!: string;
  jobSearch!: string;
  searchLoading = false;
  filteredData!: Array<job>;
  loadingData!: boolean;
  jobUrl!: string;
  corpKey: string | null = CORP_KEY;

  constructor(
    public jobService: JobService,
    private loaderService: LoaderService,
    private route: Router,
    private location: Location,
    private clipboard: Clipboard,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.jobUrl = `${enviroments.API_URL}/apply/${this.corpKey}`;
  }
  loadJobs() {
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

          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.loaderService.setLoading(false);
        this.jobData = [];
        this.toastService.error(error.message);
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
    this.route.navigateByUrl(`/job/edit/${id}`, { replaceUrl: true });
  }
  handleDeleteJob(id: string) {
    this.jobId = id;
  }

  onBack() {
    this.location.back();
  }
  onCopy() {
    this.clipboard.copy(this.jobUrl);
  }
}
