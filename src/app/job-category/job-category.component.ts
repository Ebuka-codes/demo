import { Component } from '@angular/core';
import { JobRecruitService } from '../shared/job-recruit.service';
import jobsData from 'src/assets/data.json';
@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
})
export class JobCategoryComponent {
  data: any;
  jobList = [jobsData];
  constructor(private _jobService: JobRecruitService) {}

  ngOnInit(): void {
    this._jobService.getJobList().subscribe({
      next: (response) => {
        if (response.valid) {
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
  ngOnDestroy(): void {}
}
