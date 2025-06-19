import { Component, Input } from '@angular/core';
import { job } from '../../shared/job';
import { months } from 'src/app/shared/constants';

@Component({
  selector: 'erecruit-job-view-modal',
  templateUrl: './job-view-modal.component.html',
  styleUrls: ['./job-view-modal.component.scss'],
})
export class JobViewModalComponent {
  @Input() viewJobData!: Array<job>;
  constructor() {}
  ngOnInit(): void {}
  formatDate(data: string) {
    const date = new Date(data);
    return `${
      months[date.getMonth() + 1]
    } ${date.getDate()},  ${date.getFullYear()}`;
  }
}
