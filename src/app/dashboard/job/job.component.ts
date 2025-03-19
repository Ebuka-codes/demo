import { Component, OnInit } from '@angular/core';
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
import { LoaderService } from 'src/app/shared/service/loader.service';

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
  jobId!: string;
  constructor(
    public jobService: JobService,
    private loaderService: LoaderService,
    private route: Router
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
    // this.loaderService.setLoading(true);
    // this.isLoading$ = this.loaderService.isLoading$;
    // this.searchText.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     switchMap((value) =>
    //       value ? this.jobService.filterjob(value) : of([])
    //     )
    //   )
    //   .subscribe({
    //     next: (response: any) => {
    //       if (response.valid && response.data) {
    //         this.jobData = response.data;
    //         this.loaderService.setLoading(false);
    //       } else {
    //         this.jobData = [];
    //       }
    //     },
    //     error: () => {
    //       console.log('Error: No Jobs Found');
    //       this.loaderService.setLoading(false);
    //     },
    //   });
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
}
