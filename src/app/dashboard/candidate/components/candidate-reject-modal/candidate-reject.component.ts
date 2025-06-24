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
  selector: 'erecruit-candidate-reject',
  templateUrl: './candidate-reject.component.html',
  styleUrls: ['./candidate-reject.component.scss'],
})
export class CandidateRejectComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Input() candidateId!: any;

  @Output() candidateUpdate: EventEmitter<void> = new EventEmitter();

  isLoading!: boolean;
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
    this.isLoading = false;
  }

  onConfirmReject() {
    this.isLoading = true;
    this.candidateService
      .rejectCandidateById(this.candidateId, { status: 'REJECTED' })
      .subscribe({
        next: (response) => {
          this.candidateUpdate.emit();
          this.toastService.success(response.message);
          this.close();
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isLoading = false;
        },
      });
  }
}
