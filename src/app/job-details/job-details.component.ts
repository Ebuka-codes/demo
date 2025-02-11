import { Component } from '@angular/core';
import { JobRecruitService } from '../shared/job-recruit.service';
import { FormControl } from '@angular/forms';
import jobsData from 'src/assets/data.json';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  selectedJob: any = null;
  id: any;
  minDate: any;
  availableStartDate = new FormControl('');
  constructor(private _jobService: JobRecruitService) {}

  ngOnInit(): void {
    this._jobService.selectedJob$.subscribe((jobDetails) => {
      this.selectedJob = jobDetails;
      console.log(this.selectedJob);
    });
  }
}
