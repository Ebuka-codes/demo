import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';
import * as bootstrap from 'bootstrap';
import { JobService } from '../shared/job.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-job-delete',
  templateUrl: './job-delete.component.html',
  styleUrls: ['./job-delete.component.scss'],
})
export class JobDeleteComponent {
  @ViewChild('deleteJobModal') modalElement!: ElementRef;
  @Input() jobId!: string;
  @Output() jobDeleted: EventEmitter<void> = new EventEmitter();
  modalInstance!: Modal;
  isLoading$!: Observable<boolean>;
  constructor(
    private jobService: JobService,
    private toastServie: ToastService,
    private loaderService: LoaderService
  ) {}

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement?.nativeElement);
  }
  onConfirmDelete(): void {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.jobService.deleteJob(this.jobId).subscribe({
      next: () => {
        this.loaderService.setLoading(false);
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.toastServie.success('Job removed');
        this.jobDeleted.emit();
      },
      error: () => {
        this.toastServie.error('Failed to delete job');
        this.modalInstance.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
        this.loaderService.setLoading(false);
      },
    });
  }
}
