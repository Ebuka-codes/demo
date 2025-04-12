import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobService } from '../shared/job.service';
import { job, KeyValuePair } from '../shared/job';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Observable } from 'rxjs';
import { Modal } from 'bootstrap';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
})
export class JobFilterComponent {
  @Output() updateJobData: EventEmitter<job[]> = new EventEmitter();
  @ViewChild('filterJobModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  jobTypes!: any;
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
        this.toastService.error('Error while getting filter data');
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
  onSubmit() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.filterForm.disable();
    const data = {
      ...this.filterForm.value,
      jobType: this.filterForm.get('jobType')?.value
        ? this.filterForm.get('jobType')?.value
        : '',

      workMode: this.filterForm.get('workMode')?.value
        ? this.filterForm.get('workMode')?.value
        : '',

      status: this.filterForm.get('status')?.value
        ? this.filterForm.get('status')?.value
        : '',
    };
    this.jobService.filterJob(data).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.updateJobData.emit(response.data);
          this.closeModal();
          this.filterForm.enable();
          this.resetFilterJobForm();
        } else {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.toastService.error('Error occurred while filtering');
          this.filterForm.enable();
        }
      },
      error: (err) => {
        this.toastService.error('Error occurred while filtering');
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
        this.closeModal();
        this.filterForm.enable();
        this.resetFilterJobForm();
      },
    });
  }
}
