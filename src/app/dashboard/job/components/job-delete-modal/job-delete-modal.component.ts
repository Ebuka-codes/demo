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
declare var $: any;
@Component({
  selector: 'erecruit-job-delete-modal',
  templateUrl: './job-delete-modal.component.html',
  styleUrls: ['./job-delete-modal.component.scss'],
})
export class JobDeleteModalComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Input() jobId!: string;

  @Output() jobDeleted: EventEmitter<void> = new EventEmitter();

  isLoading!: boolean;
  constructor(
    private jobService: JobService,
    private toastServie: ToastService
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

  onConfirmDelete(): void {
    this.isLoading = true;
    this.jobService.deleteJob(this.jobId).subscribe({
      next: (response: any) => {
        this.toastServie.success(response.message);
        this.jobDeleted.emit();
        this.close();
      },
      error: (error) => {
        this.toastServie.error(error.message);
        this.isLoading = false;
      },
    });
  }
}
