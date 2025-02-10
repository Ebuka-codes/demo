import { Component, ViewChild } from '@angular/core';
import { JobListingComponent } from '../job-listing/job-listing.component';
import { JobRecruitService } from '../shared/job-recruit.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  selectedJob: any = null;
  minDate: any;
  availableStartDate = new FormControl('');
  constructor(private _jobService: JobRecruitService) {}

  ngOnInit(): void {
    this._jobService.selectedJob$.subscribe((job) => {
      this.selectedJob = job;
    });
    this.minDate = new Date().toISOString().split('T')[0];
    console.log(this.availableStartDate.value);
  }
}
