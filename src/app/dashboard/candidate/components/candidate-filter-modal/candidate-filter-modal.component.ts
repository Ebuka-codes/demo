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
import { LoaderService } from 'src/app/shared/service/loader.service';
import { CandidateService } from '../../shared/candidate.service';
import { finalize, Observable } from 'rxjs';
import { Candidate } from '../../shared/candidate';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-candidate-filter',
  templateUrl: './candidate-filter-modal.component.html',
  styleUrls: ['./candidate-filter-modal.component.scss'],
})
export class CandidateFilterModalComponent {
  @ViewChild('filterCandidateModal') modalElement!: ElementRef;
  @Output() updateCandidateData: EventEmitter<Candidate[]> = new EventEmitter();
  modalInstance!: Modal;
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
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.filterForm = this.fb.group({
      jobTitle: [''],
      status: [''],
    });
  }
  ngOnInit(): void {
    this.getJobTitle();
  }
  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  getJobTitle() {
    this.candidateService.getAllJobs().subscribe({
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

  closeModal() {
    this.modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop?.remove();
    }
  }
  resetFilterCandidateForm() {
    this.filterForm.reset();
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
      this.candidateService
        .filterCandidate(data)
        .pipe(finalize(() => (this.isLoading = true)))
        .subscribe({
          next: (response: any) => {
            if (response.valid && response.data) {
              this.closeModal();
              this.updateCandidateData.emit(response.data);
              this.toastService.success(response.message);
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.closeModal();
            this.toastService.error(error.message);
          },
        });
    }
  }
}
