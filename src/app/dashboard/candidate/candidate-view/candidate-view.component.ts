import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Candidate } from '../shared/candidate';
import { Notyf } from 'notyf';
import { CandidateService } from '../shared/candidate.service';
import { DashboardService } from '../../dashboard.service';
import { Modal } from 'bootstrap';
import * as bootsrap from 'bootstrap';
import { take } from 'rxjs';

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss'],
})
export class CandidateViewComponent {
  @Input() candidateViewData!: Candidate;
  @Output() handleUpdateCandidateTable: EventEmitter<void> = new EventEmitter();
  @ViewChild('myModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  notyf = new Notyf();

  constructor(
    private candidateService: CandidateService,
    private dashboardService: DashboardService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootsrap.Modal(this.modalElement.nativeElement);
  }
  hireCandidate(id: string) {
    this.dashboardService.setLoading(true);
    this.candidateService
      .hireCandidateById(id, { status: 'HIRED' })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.handleUpdateCandidateTable.emit();
          this.notyf.success({
            message: response.message,
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
        },
        error: (error) => {
          this.dashboardService.setLoading(false);
          this.notyf.error({
            message: 'Error hiring candidate!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
        },
      });
  }

  rejectCandidate(id: string) {
    this.dashboardService.setLoading(true);
    this.candidateService
      .rejectCandidateById(id, { status: 'REJECTED' })
      .subscribe({
        next: (response: any) => {
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.notyf.success({
            message: response.message,
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
          this.handleUpdateCandidateTable.emit();
        },
        error: () => {
          this.dashboardService.setLoading(false);
          this.notyf.error({
            message: 'Error rejecting Candidate!',
            duration: 4000,
            position: { x: 'right', y: 'top' },
          });
          this.dashboardService.setLoading(false);
        },
      });
  }
}
