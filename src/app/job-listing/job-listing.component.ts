import { Component, OnInit } from '@angular/core';
import { JobRecruitService } from '../shared/job-recruit.service';
import jobsData from 'src/assets/data.json';
import { jobType } from '../shared/type';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnInit {
  jobList: Array<jobType> = [];
  selectedJob: any;
  isLoading: boolean = false;
  constructor(private _jobService: JobRecruitService) {}
  selectJob(jobDetails: any) {
    this._jobService.setSelectedJob(jobDetails);
  }
  ngOnInit(): void {
    this.getJobList();
  }
  getJobList() {
    this.isLoading = true;
    this._jobService.getJobList().subscribe({
      next: (response) => {
        if (response.valid) {
          this.isLoading = false;
          const updatedJobList = Array.isArray(response.data)
            ? [jobsData, ...response.data]
            : [jobsData];
          this.jobList = updatedJobList;
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }
  showMoreJob() {}
}
