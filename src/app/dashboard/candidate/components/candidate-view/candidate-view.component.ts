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
import { finalize } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { CandidateSearchModalComponent } from '../candidate-search-modal/candidate-search-modal.component';
import { CandidateScheduleDateComponent } from '../candidate-schedule-date/candidate-schedule-date.component';
import { CandidateMailModalComponent } from '../candidate-mail-modal/candidate-mail-modal.component';

@Component({
  selector: 'erecruit-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss'],
})
export class CandidateViewComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @ViewChild(CandidateScheduleDateComponent)
  CandidateScheduleDateComponent!: CandidateScheduleDateComponent;

  @ViewChild(CandidateMailModalComponent)
  CandidateMailModalComponent!: CandidateMailModalComponent;

  @ViewChild(CandidateViewComponent)
  CandidateViewComponent!: CandidateViewComponent;

  @Input() candidateViewData!: Candidate;

  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();

  @Output() openScheduleModal: EventEmitter<string> = new EventEmitter();

  @Output() openMailCandidateModal: EventEmitter<any> = new EventEmitter();

  candidateId!: string;

  isRejecting!: boolean;

  isHiring!: boolean;

  constructor(
    private candidateService: CandidateService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit() {
    this.modalInstance = Modal.getOrCreateInstance(
      this.modalElementRef.nativeElement
    );
    this.modalElementRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        // Ensure the cleanup happens after hide()
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    );
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.isRejecting = false;
    this.isHiring = false;
  }

  hireCandidate(id: string) {
    this.isHiring = true;
    this.candidateService.hireCandidateById(id, { status: 'HIRED' }).subscribe({
      next: (response) => {
        this.candidateUpdate.emit();
        this.toastService.success(response.message);
        this.close();
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.isHiring = false;
      },
    });
  }
  rejectCandidate(id: string) {
    this.isRejecting = true;
    this.candidateService
      .rejectCandidateById(id, { status: 'REJECTED' })
      .subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.candidateUpdate.emit();
          this.close();
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isRejecting = false;
        },
      });
  }

  onScheduleDate(id: string) {
    this.openScheduleModal.emit(id);
    this.CandidateScheduleDateComponent.open();
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
