import { Component } from '@angular/core';
import { JobRecruitService } from '../shared/job-recruit.service';
import { jobType } from '../shared/type';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent {
  data: Array<jobType> = [];
  constructor(private _jobService: JobRecruitService) {}
  getJobListing(): void {
    this._jobService.getJobListing().subscribe({
      next: (response) => {
        this.data = response.data;
      },
      error: (error) => console.log(error.message),
    });
  }
}
