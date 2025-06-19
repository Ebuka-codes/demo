import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { JobService } from '../../shared/job.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { finalize } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'erecruit-job-delete-modal',
  templateUrl: './job-delete-modal.component.html',
  styleUrls: ['./job-delete-modal.component.scss'],
})
export class JobDeleteModalComponent {
  @ViewChild('deleteJobModal') modalElement!: ElementRef;
  @Input() jobId!: string;
  @Output() jobDeleted: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  isLoading!: boolean;
  constructor(
    private jobService: JobService,
    private toastServie: ToastService
  ) {}

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
  }
  onConfirmDelete(): void {
    this.isLoading = true;
    this.jobService
      .deleteJob(this.jobId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
          this.toastServie.success(response.message);
          this.jobDeleted.emit();
        },
        error: (error) => {
          this.toastServie.error(error.message);
          this.modalInstance.hide();
          const backdrop = document.querySelector('.modal-backdrop');
          backdrop?.remove();
        },
      });
  }
}
