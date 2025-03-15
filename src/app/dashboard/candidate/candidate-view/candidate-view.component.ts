import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Candidate } from '../shared/candidate';
import { CandidateService } from '../shared/candidate.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject, take } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss'],
})
export class CandidateViewComponent {
  @Input() candidateViewData!: Candidate;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  @ViewChild('myModal') modalElement!: ElementRef;
  @ViewChild('scheduleModal') modalSchedule!: ElementRef;
  modalInstance!: Modal;
  modalScheduleInstance!: Modal;
  workHistories$ = new BehaviorSubject<any[]>([]);
  candidateId!: string;

  constructor(
    private candidateService: CandidateService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candidateViewData']?.currentValue) {
      setTimeout(() => {
        this.workHistories$.next(this.candidateViewData?.workHistories || []);
        this.cdr.detectChanges();
      }, 0);
    }
  }
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
  openScheduleModal(id: string) {
    const viewCandidateModal =
      Modal.getInstance(
        document.getElementById('viewCandidateModal') as HTMLDivElement
      ) ||
      new Modal(
        document.getElementById('viewCandidateModal') as HTMLDivElement
      );
    viewCandidateModal.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();

    const scheduleModal = new Modal(
      document.getElementById('scheduleModal') as HTMLDivElement
    );
    this.candidateId = id;
    scheduleModal.show();
  }
  updateCandidateTable() {
    this.candidateUpdate.emit();
  }
}
