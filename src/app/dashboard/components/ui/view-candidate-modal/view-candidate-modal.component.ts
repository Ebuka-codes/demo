import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-candidate-modal',
  templateUrl: './view-candidate-modal.component.html',
  styleUrls: ['./view-candidate-modal.component.scss'],
})
export class ViewCandidateModalComponent {
  @Input() candidateViewData: any;
  constructor() {
    console.log(this.candidateViewData);
  }
}
