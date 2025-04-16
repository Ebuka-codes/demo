import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Candidate } from '../../shared/candidate';
import { CandidateService } from '../../shared/candidate.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { take } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss'],
})
export class CandidateViewComponent {
  @Input() candidateViewData!: Candidate;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  @Output() openScheduleModal: EventEmitter<string> = new EventEmitter();
  @Output() openMailCandidateModal: EventEmitter<any> = new EventEmitter();
  @ViewChild('myModal') modalElement!: ElementRef;
  @ViewChild('scheduleModal') modalSchedule!: ElementRef;
  modalInstance!: Modal;
  modalScheduleInstance!: Modal;
  candidateId!: string;

  constructor(
    private candidateService: CandidateService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  hireCandidate(id: string) {
    this.loaderService.setLoading(true);
    this.candidateService
      .hireCandidateById(id, { status: 'HIRED' })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.candidateUpdate.emit();
          this.toastService.success('Candidate hired successfully');
        },
        error: () => {
          this.loaderService.setLoading(false);
          this.toastService.error('Error hiring candidate!');
        },
      });
  }
  rejectCandidate(id: string) {
    this.loaderService.setLoading(true);
    this.candidateService
      .rejectCandidateById(id, { status: 'REJECTED' })
      .subscribe({
        next: () => {
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.toastService.success('Candidate rejected');
          this.candidateUpdate.emit();
        },
        error: () => {
          this.toastService.error('Error rejecting Candidate!');
          this.loaderService.setLoading(false);
        },
      });
  }

  onScheduleDate(id: string) {
    this.openScheduleModal.emit(id);
    const backdrop = document.querySelector('.modal-backdrop');
  }

  updateCandidateTable() {
    this.candidateUpdate.emit();
  }

  formatDate(value: string) {
    const date = new Date(value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  onMailCandidate() {
    this.openMailCandidateModal.emit();
  }
}
