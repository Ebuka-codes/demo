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
import { Modal } from 'bootstrap';
import * as bootsrap from 'bootstrap';
import { take } from 'rxjs';
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
  notyf = new Notyf();

  constructor(
    private candidateService: CandidateService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootsrap.Modal(this.modalElement.nativeElement);
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

  handleText() {
    this.modalInstance.hide();

    this.modalScheduleInstance.show();
  }
}
