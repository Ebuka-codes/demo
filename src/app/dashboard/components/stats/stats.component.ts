import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardStats } from '../../admin-dashboard/shared/dashboardStats';
Chart.register(...registerables);

@Component({
  selector: 'erecruit-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  @Input() data!: DashboardStats;
  @Input() candidateData!: any;
  candidateStats!: any[];
  option: string | null = 'Total';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.candidateInfo) {
      this.candidateStats = Object.entries({
        Pending: this.data?.candidateInfo?.pending || 2,
        Interview: this.data?.candidateInfo?.interview || 5,
        Hired: this.data?.candidateInfo?.hired || 8,
        Rejected: this.data?.candidateInfo?.rejected || 9,
      }).map(([key, value]) => ({
        label: key,
        value,
      }));
      this.Renderhart();
    }
  }

  colors1 = ['#1ddb49f7', '#141d28', '#28a745'];

  colors2 = ['#FBC784', '#2E78EE', '#28a745', '#e50c20'];

  Renderhart() {
    new Chart('barChart', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.candidateStats,
            backgroundColor: this.colors2,
          },
        ],
        labels: this.candidateStats?.map((item) => item?.value),
      },
      options: {
        cutout: '80%',
        radius: '70%',
        rotation: 360,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        parsing: {
          key: 'value',
        },
        spacing: 0,
        datasets: {
          doughnut: {
            hoverBackgroundColor: '#ffff',
            borderColor: '#fff',
            clip: 1,
            borderJoinStyle: 'miter',
          },
        },

        elements: {
          point: {},
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  onToggle(event: Event) {
    const element = event.target as HTMLElement;
    this.option = element.textContent;
  }
}
