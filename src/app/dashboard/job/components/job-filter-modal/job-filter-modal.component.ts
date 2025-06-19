import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobService } from '../../shared/job.service';
import { job, jobFilterPayload, KeyValuePair } from '../../shared/job';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { finalize, Observable } from 'rxjs';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'erecruit-job-filter-modal',
  templateUrl: './job-filter-modal.component.html',
  styleUrls: ['./job-filter-modal.component.scss'],
})
export class JobFilterModalComponent {
  @Output() updateJobData: EventEmitter<job[]> = new EventEmitter();
  @ViewChild('filterJobModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  jobTypes!: any;
  isLoading!: boolean;
  workModes = new Array<KeyValuePair>(
    {
      key: 'REMOTE',
      value: 'Remote',
    },
    {
      key: 'HYBRID',
      value: 'Hybrid',
    },
    {
      key: 'On_SITE',
      value: 'On-site',
    }
  );
  status = new Array<KeyValuePair>(
    {
      key: 'APPROVED',
      value: 'Approved',
    },
    {
      key: 'PENDING',
      value: 'Pending',
    },
    {
      key: 'REJECTED',
      value: 'Rejected',
    }
  );
  filterForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.filterForm = this.fb.group({
      jobType: [''],
      workMode: [''],
      status: [''],
    });
  }
  ngAfterViewInit(): void {
    this.getJobType();
    this.modalInstance = new Modal(this.modalElement?.nativeElement);
  }
  resetFilterJobForm() {
    this.filterForm.reset();
  }

  getJobType() {
    this.jobService.getJobType().subscribe({
      next: (reponse: any) => {
        if (reponse.valid && reponse.data) {
          this.jobTypes = new Set(reponse.data);
        }
      },
      error: (err) => {
        this.toastService.error(err.message);
      },
    });
  }

  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop?.remove();
    }
  }

  onFilterJob(payload: jobFilterPayload) {
    this.isLoading = true;
    this.jobService
      .filterJob(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.updateJobData.emit(response.data);
            this.closeModal();
            this.resetFilterJobForm();
            this.toastService.success(response.message);
          } else {
            this.isLoading$ = this.loaderService.isLoading$;
            this.toastService.error(response.message);
          }
        },
        error: (err) => {
          this.toastService.error(err.message);
          this.closeModal();
          this.resetFilterJobForm();
        },
      });
  }
  getPayload(): jobFilterPayload {
    const rawValues = this.filterForm.value;
    const payload: jobFilterPayload = {};
    Object.keys(rawValues).forEach((key) => {
      const value = rawValues[key];
      if (value) {
        payload[key as keyof jobFilterPayload] = value;
      }
    });

    return payload;
  }
  onSubmit() {
    const payload = this.getPayload();
    if (
      this.filterForm.get('jobType')?.value ||
      this.filterForm.get('workMode')?.value ||
      this.filterForm.get('status')?.value
    ) {
      this.onFilterJob(payload);
    } else {
      this.closeModal();
    }
  }
}
