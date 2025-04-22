import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CandidateService } from '../../shared/candidate.service';
import { finalize } from 'rxjs';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';
@Component({
  selector: 'app-candidate-reject',
  templateUrl: './candidate-reject.component.html',
  styleUrls: ['./candidate-reject.component.scss'],
})
export class CandidateRejectComponent {
  @Input() candidateId!: any;
  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();
  @ViewChild('candidateRejectModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  isLoading!: boolean;
  constructor(
    private candidateService: CandidateService,
    private toastService: ToastService
  ) {}
  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    backdrop?.remove();
  }
  onConfirmReject() {
    this.isLoading = true;
    this.candidateService
      .rejectCandidateById(this.candidateId, { status: 'REJECTED' })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.modalInstance.hide();
          this.candidateUpdate.emit();
          this.closeModal();
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.closeModal();
        },
      });
  }
}
