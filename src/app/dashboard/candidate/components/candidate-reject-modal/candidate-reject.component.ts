import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CandidateService } from '../../shared/candidate.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Observable } from 'rxjs';
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
  isLoading$!: Observable<boolean>;
  constructor(
    private candidateService: CandidateService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  onConfirmReject() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.candidateService
      .rejectCandidateById(this.candidateId, { status: 'REJECTED' })
      .subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.loaderService.setLoading(false);
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.candidateUpdate.emit();
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
        },
      });
  }
}
