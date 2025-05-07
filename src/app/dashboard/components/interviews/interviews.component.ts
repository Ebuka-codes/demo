import {
  Component,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  Input,
} from '@angular/core';
import flatpickr from 'flatpickr';
import { DashboardStats } from '../../admin-dashboard/shared/dashboardStats';

@Component({
  selector: 'erecruit-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss'],
})
export class InterviewsComponent implements AfterViewInit, OnChanges {
  @Input() data!: DashboardStats;
  candidateStats!: any[];
  ngAfterViewInit(): void {
    flatpickr('#calendar', {
      inline: true,
      enableTime: false,
      defaultDate: new Date(),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.candidateInfo) {
      this.candidateStats = Object.entries({
        Interview: this.data?.candidateInfo?.interview || 5,
      }).map(([key, value]) => ({
        label: key,
        value,
      }));
    }
  }
}
