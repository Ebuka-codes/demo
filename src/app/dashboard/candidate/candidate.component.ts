import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';

import { Observable } from 'rxjs';
import { Candidate, QuestionData } from './shared/candidate';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import { MatSelect } from '@angular/material/select';
import { CandidateService } from './shared/candidate.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CandidateSearchModalComponent } from './components/candidate-search-modal/candidate-search-modal.component';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  @ViewChild('viewCandidateModal') firstModal!: ElementRef;
  @ViewChild('scheduleDateModal') secondModal!: ElementRef;
  @ViewChild('matSelect') matSelect!: MatSelect;

  candidateData!: Array<Candidate>;
  filteredCandidate!: Array<Candidate>;
  isLoading!: Observable<boolean>;
  candidateViewData: any;
  searchText!: string;
  candidateId!: string;
  scheduleModalOpen: boolean = false;
  job: any;
  qualifiedQuestionData!: Array<QuestionData>;
  selectedJob!: string;
  selectedAllChecked: boolean = false;
  selectedIds: string[] = [];
  tabs: string[] = ['Candidate', 'Shortlisted', 'Interview'];
  activeTag = 'Candidate';
  shortListedData!: Array<Candidate>;
  interviewData!: Array<Candidate>;
  selectedJobId!: string;
  searchFilterData: WritableSignal<any | null> = signal(null);
  private offcanvasService = inject(NgbOffcanvas);
  closeResult: WritableSignal<string> = signal('');

  constructor(
    private toastService: ToastService,
    private loaderService: LoaderService,
    private candidateService: CandidateService,
    private location: Location
  ) {}
  ngOnInit() {
    this.loadAllJob();
  }
  onSelectedJob() {
    this.selectedJobId = this.matSelect.value.id;
    this.loadCandidateByJobId(this.selectedJobId);
  }
  onToggletabs(tab: string) {
    this.activeTag = tab;
    if (this.activeTag === 'Shortlisted') {
      this.filteredCandidate = this.candidateData.filter(
        (item) => item.status === 'SHORTLIST'
      );
    } else if (this.activeTag === 'Interview') {
      this.filteredCandidate = this.candidateData.filter(
        (item) => item.status === 'INTERVIEW_SCHEDULED'
      );
    } else {
      this.filteredCandidate = this.candidateData;
    }
  }

  onToggleAllCheckbox() {
    this.selectedAllChecked = !this.selectedAllChecked;
    if (this.selectedAllChecked) {
      this.selectedIds = this.filteredCandidate.map((item) => item.id);
    } else {
      this.selectedIds = [];
    }
  }
  onToggleSelection(id: string) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter((itemId) => itemId !== id);
    } else {
      this.selectedIds.push(id);
    }
    this.selectedAllChecked =
      this.selectedIds.length === this.filteredCandidate.length;
  }
  loadAllJob() {
    this.loaderService.setLoading(true);
    this.candidateService.getAllJobs().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.job = response.data;
          console.log(this.job);
          this.loaderService.setLoading(false);
        }
      },
      error: (error) => {
        this.toastService.error(error.error.message);
        this.loaderService.setLoading(false);
      },
      complete: () => {
        console.log('All jobs fetched');
      },
    });
  }
  loadCandidateByJobId(jobId: string) {
    this.loaderService.setLoading(true);
    this.isLoading = this.loaderService.isLoading$;
    this.candidateService.getCandidateByJobId(jobId).subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.candidateData = response.data;
          this.filteredCandidate = this.candidateData;
          this.loaderService.setLoading(false);
          this.isLoading = this.loaderService.isLoading$;
        }
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
        this.isLoading = this.loaderService.isLoading$;
      },
      complete: () => {
        this.loaderService.setLoading(false);
        this.isLoading = this.loaderService.isLoading$;
      },
    });
  }

  onShorListCandidate() {
    const data = {
      ids: this.selectedIds,
    };
    if (data.ids.length > 0) {
      this.loaderService.setLoading(true);
      this.candidateService.shorListCandidate(data).subscribe({
        next: (response: any) => {
          this.shortListedData = response.data;
          this.loaderService.setLoading(false);
          this.toastService.success('Shortlisted successfully');
          this.selectedIds = [];
          this.loadCandidateByJobId(this.selectedJobId);
        },
        error: (err) => {
          console.log(err);
          this.loaderService.setLoading(false);
          this.toastService.error(err.message);
        },
      });
    }
  }
  getCandidates() {
    this.loadCandidateByJobId(this.selectedJobId);
  }
  openScheduleModal(id: string) {
    this.closModal('viewCandidateModal');
    const scheduleModal = new Modal(
      document.getElementById('scheduleModal') as HTMLDivElement
    );
    this.candidateId = id;
    scheduleModal.show();
  }
  openMailCandidateModal() {
    this.closModal('viewCandidateModal');
    const mailCandidateModal = new Modal(
      document.getElementById('mailCandidateModal') as HTMLDivElement
    );
    mailCandidateModal.show();
  }
  openFilterModal() {
    const modal = Modal.getInstance(
      (document.querySelector('#filterCandidateModal') as HTMLDivElement) ||
        new Modal(
          document.querySelector('#filterCandidateModal') as HTMLDivElement
        )
    );
    modal?.show();
  }
  updateCandidateData(data: Candidate[]) {
    this.candidateData = data;
  }

  closModal(modalId: string) {
    const viewCandidateModal =
      Modal.getInstance(document.getElementById(modalId) as HTMLDivElement) ||
      new Modal(document.getElementById(modalId) as HTMLDivElement);
    viewCandidateModal.hide();

    setTimeout(() => {
      if (document.querySelector('.modal.show') === null) {
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }, 300);
  }

  onViewCandidate(id: string) {
    if (id) {
      this.candidateViewData = this.filteredCandidate.find(
        (candidate: any) => candidate.id === id
      );
      const viewCandidateModal =
        Modal.getInstance(
          document.getElementById('viewCandidateModal') as HTMLDivElement
        ) ||
        new Modal(
          document.getElementById('viewCandidateModal') as HTMLDivElement
        );

      viewCandidateModal.show();
    }
  }
  onScheduleDate(id: string) {
    this.scheduleModalOpen = true;
    this.candidateId = id;
    const modal =
      Modal.getInstance(
        document.getElementById('scheduleModal') as HTMLDivElement
      ) ||
      new Modal(document.getElementById('scheduleModal') as HTMLDivElement);
    modal.show();
  }

  onReject(id: string) {
    this.candidateId = id;
  }

  onBack() {
    this.location.back();
  }

  open() {
    const ref = this.offcanvasService.open(CandidateSearchModalComponent, {
      position: 'end',
    });
    ref.componentInstance.onSearch = (data: any) => {
      this.searchFilterData.set(data);
      ref.close();
    };
  }

  clearSearchFilter() {
    this.searchFilterData.set(null);
  }

  get isSearchFilterActive() {
    return this.searchFilterData() !== null;
  }
  onSearchFilter() {
    this.loaderService.setLoading(true);
    this.candidateService
      .searchFilter({ ...this.searchFilterData(), jobid: this.selectedJobId })
      .subscribe({
        next: (response: any) => {
          if (response.valid && response.data) {
            this.filteredCandidate = response.data;
            this.loaderService.setLoading(false);
            this.clearSearchFilter();
          } else {
            this.loaderService.setLoading(false);
            this.clearSearchFilter();
          }
        },
        error: (error) => {
          this.loaderService.setLoading(false);
          this.toastService.error(error.message);
          this.clearSearchFilter();
        },
      });
  }
}
