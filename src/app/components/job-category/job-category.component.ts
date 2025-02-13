import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JobRecruitService } from '../../shared/job-recruit.service';
import jobsData from 'src/assets/data.json';
import { jobType } from 'src/app/shared/type';
@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class JobCategoryComponent {
  data: any;
  @Input() jobsList!: any[];
  constructor(private _jobService: JobRecruitService) {}

  // ngOnInit(): void {
  //   this._jobService.getJobList().subscribe({
  //     next: (response) => {
  //       if (response.valid && response.data) {
  //         this.jobList = response.data;
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     },
  //   });
  // }
  ngOnDestroy(): void {}
}
