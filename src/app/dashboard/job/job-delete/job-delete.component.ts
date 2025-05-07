import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import * as bootstrap from 'bootstrap';
import { JobService } from '../shared/job.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'erecruit-job-delete',
  templateUrl: './job-delete.component.html',
  styleUrls: ['./job-delete.component.scss'],
})
export class JobDeleteComponent {
  @ViewChild('deleteJobModal') modalElement!: ElementRef;
  @Input() jobId!: string;
  @Output() jobDeleted: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  isLoading!: boolean;
  constructor(
    private jobService: JobService,
    private toastServie: ToastService,
    private loaderService: LoaderService
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
