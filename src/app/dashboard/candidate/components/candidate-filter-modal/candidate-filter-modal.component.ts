import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { job, KeyValuePair } from '../../../job/shared/job';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { CandidateService } from '../../shared/candidate.service';
import { finalize } from 'rxjs';
import { Candidate } from '../../shared/candidate';
import { ToastService } from 'src/app/core/service/toast.service';
import { JobService } from 'src/app/dashboard/job/shared/job.service';

@Component({
  selector: 'erecruit-candidate-filter',
  templateUrl: './candidate-filter-modal.component.html',
  styleUrls: ['./candidate-filter-modal.component.scss'],
})
export class CandidateFilterModalComponent {
  @ViewChild('modalRoot', { static: true }) modalElementRef!: ElementRef;

  private modalInstance!: Modal;

  @Output() updateCandidateData: EventEmitter<Candidate[]> = new EventEmitter();

  filterForm!: FormGroup;
  status = new Array<KeyValuePair>(
    {
      key: 'HIRED',
      value: 'Hired',
    },
    {
      key: 'REJECTED',
      value: 'Rejected',
    },
    {
      key: 'PENDING',
      value: 'Pending',
    },
    {
      key: 'INTERVIEW_SCHEDULED',
      value: 'Interview',
    }
  );
  jobTitle: any;
  isLoading!: boolean;
  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastService: ToastService,
    private jobService: JobService
  ) {
    this.filterForm = this.fb.group({
      jobTitle: [''],
      status: [''],
    });
  }
  ngOnInit(): void {
    this.getJobTitle();
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
  }

  open() {
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
    this.filterForm.reset();
  }

  getJobTitle() {
    this.jobService.getAllJobs().subscribe({
      next: (reponse: any) => {
        if (reponse.valid && reponse.data) {
          this.jobTitle = new Set(reponse.data.map((job: job) => job.jobTitle));
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  onSubmit() {
    const data = {
      jobTitle: this.filterForm.get('jobTitle')?.value,
      status: this.filterForm.get('status')?.value,
    };
    if (
      this.filterForm.get('jobTitle')?.value ||
      this.filterForm.get('status')?.value
    ) {
      this.isLoading = true;
      this.candidateService.filterCandidate(data).subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.updateCandidateData.emit(response.data);
            this.toastService.success(response.message);
            this.close();
          } else {
            this.toastService.error(response.message);
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.isLoading = false;
        },
      });
    }
  }
}
