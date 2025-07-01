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
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'erecruit-job-filter-modal',
  templateUrl: './job-filter-modal.component.html',
  styleUrls: ['./job-filter-modal.component.scss'],
})
export class JobFilterModalComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Output() updateJobData: EventEmitter<job[]> = new EventEmitter();

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
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private toastService: ToastService
  ) {
    this.filterForm = this.fb.group({
      jobType: [''],
      workMode: [''],
      status: [''],
    });
  }

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
    this.getJobType();
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.filterForm.reset();
    this.isLoading = false;
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

  onFilterJob(payload: jobFilterPayload) {
    this.isLoading = true;
    this.jobService.filterJob(payload).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.updateJobData.emit(response.data);
          this.toastService.success(response.message);
          this.close();
        } else {
          this.toastService.error(response.message);
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.toastService.error(err.message);
        this.isLoading = false;
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
      this.close();
    }
  }
}
