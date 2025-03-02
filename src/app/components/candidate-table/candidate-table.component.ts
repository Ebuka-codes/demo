import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.scss'],
})
export class CandidateTableComponent {
  workType: string[] = ['Remote', 'Full-time'];
  selectedValue!: string;
  constructor() {}
  handleWorkType(value: string) {
    this.selectedValue = value;
  }
}
