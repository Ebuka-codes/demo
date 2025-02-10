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
    this._jobService.selectedJob$.subscribe((job) => {
      this.data = job;
    });
  }
  ngOnDestroy(): void {}
}
