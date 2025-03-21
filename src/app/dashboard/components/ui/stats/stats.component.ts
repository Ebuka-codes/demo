import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  data = [
    { id: 'Job Boards', nested: { value: 30 } },
    { id: 'Online', nested: { value: 15 } },
    { id: 'Recruitment Agency', nested: { value: 40 } },
  ];

  candidate = [
    { id: 'Pending', nested: { value: 30 } },
    { id: 'Interview', nested: { value: 15 } },
    { id: 'Hired', nested: { value: 60 } },
    { id: 'Rejected', nested: { value: 10 } },
  ];

  ngOnInit(): void {
    this.Renderhart();
  }
  total = this.data
    .map((values) => values.nested.value)
    .reduce((a, b) => a + b, 0);

  totalCandidate = this.candidate
    .map((values) => values.nested.value)
    .reduce((a, b) => a + b, 0);

  colors1 = ['#1ddb49f7', '#141d28', '#28a745'];

  colors2 = ['#FBC784', '#2E78EE', '#28a745', '#e50c20'];

  Renderhart() {
    new Chart('barChart1', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors1,
          },
        ],
        labels: this.data.map((item) => item.id),
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
          key: 'nested.value',
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

    new Chart('barChart2', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.candidate,
            backgroundColor: this.colors2,
          },
        ],
        labels: this.candidate.map((item) => item.id),
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
          key: 'nested.value',
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
}
