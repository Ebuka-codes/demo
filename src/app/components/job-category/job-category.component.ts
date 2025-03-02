import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { jobType } from 'src/app/shared/type';

@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class JobCategoryComponent implements OnInit {
  @Input() jobCategory!: any[];
  @Input() jobList: jobType[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  constructor() {}

  selectedJobTypes: string[] = [];
  toggleJobType(type: string) {
    const index = this.selectedJobTypes.indexOf(type);

    if (index !== -1) {
      this.selectedJobTypes.splice(index, 1);
    } else {
      this.selectedJobTypes.push(type);
    }
    this.filterChanged.emit([...this.selectedJobTypes]);
  }
  ngOnInit() {
    this.jobCategory = [
      ...new Set(this.jobCategory?.map((job) => job.jobType).sort()),
    ];
    console.log(this.jobCategory);
  }
}
