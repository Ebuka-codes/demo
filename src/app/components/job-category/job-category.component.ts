import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JobRecruitService } from '../../shared/job-recruit.service';
import { jobType } from 'src/app/shared/type';
@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class JobCategoryComponent {
  data!: jobType[];
  @Input() jobsList!: any[];
  constructor() {}
  ngOnInit(): void {
    this.data = this.jobsList?.map((item) => item.jobType);
  }
}
