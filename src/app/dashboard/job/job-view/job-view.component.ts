import { Component, Input } from '@angular/core';
import { job } from '../shared/job';
import { months } from 'src/app/shared/constants';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
})
export class JobViewComponent {
  @Input() viewJobData!: Array<job>;
  constructor() {}
  ngOnInit(): void {
    console.log(this.viewJobData);
  }
  formatDate(data: string) {
    const date = new Date(data);
    return `${
      months[date.getMonth() + 1]
    } ${date.getDate()},  ${date.getFullYear()}`;
  }
}
