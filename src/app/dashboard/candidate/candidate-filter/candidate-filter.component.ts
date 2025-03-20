import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { job, KeyValuePair } from '../../job/shared/job';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { CandidateService } from '../shared/candidate.service';
import { Observable } from 'rxjs';
import { Candidate } from '../shared/candidate';

@Component({
  selector: 'app-candidate-filter',
  templateUrl: './candidate-filter.component.html',
  styleUrls: ['./candidate-filter.component.scss'],
})
export class CandidateFilterComponent {
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
  isLoading$!: Observable<boolean>;
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
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    const data = {
      jobTitle: this.filterForm.get('jobTitle')?.value,
      status: this.filterForm.get('status')?.value,
    };
    this.filterForm.disable();
    this.candidateService.filterCandidate(data).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.closeModal();
          this.filterForm.enable();
          this.updateCandidateData.emit(response.data);
        } else {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.toastService.error('Error occurred while filtering');
          this.filterForm.enable();
        }
      },
      error: () => {
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
        this.toastService.error('Error occurred while filtering');
        this.filterForm.enable();
        this.closeModal();
      },
    });
  }
}
