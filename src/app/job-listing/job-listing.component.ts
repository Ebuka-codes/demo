import { Component, OnInit } from '@angular/core';
import { JobRecruitService } from '../shared/job-recruit.service';
import jobsData from 'src/assets/data.json';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent {
  jobList = jobsData;
  selectedJob: any;
  isLoading: boolean = false;
  constructor(private _jobService: JobRecruitService) {}

  selectJob(job: any) {
    this._jobService.setSelectedJob(job);
  }
}
