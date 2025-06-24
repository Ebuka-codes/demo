import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';

import { finalize, Observable } from 'rxjs';
import { Candidate, QuestionData } from './shared/candidate';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';
import { MatSelect } from '@angular/material/select';
import { CandidateService } from './shared/candidate.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { Location } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CandidateSearchModalComponent } from './components/candidate-search-modal/candidate-search-modal.component';
import { JobService } from '../job/shared/job.service';
import { InterviewerService } from '../interviewer/shared/interviewer.service';
import { CandidateViewComponent } from './components/candidate-view/candidate-view.component';
import { CandidateScheduleDateComponent } from './components/candidate-schedule-date/candidate-schedule-date.component';
import { CandidateMailModalComponent } from './components/candidate-mail-modal/candidate-mail-modal.component';
import { CandidateRejectComponent } from './components/candidate-reject-modal/candidate-reject.component';
import { CandidateFilterModalComponent } from './components/candidate-filter-modal/candidate-filter-modal.component';

@Component({
  selector: 'erecruit-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  @ViewChild(CandidateViewComponent)
  CandidateViewComponent!: CandidateViewComponent;

  @ViewChild(CandidateScheduleDateComponent)
  CandidateScheduleDateComponent!: CandidateScheduleDateComponent;

  @ViewChild(CandidateMailModalComponent)
  CandidateMailModalComponent!: CandidateMailModalComponent;

  @ViewChild(CandidateRejectComponent)
  CandidateRejectComponent!: CandidateRejectComponent;

  @ViewChild(CandidateFilterModalComponent)
  CandidateFilterModalComponent!: CandidateFilterModalComponent;

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
  selectedCandidateIds: string[] = [];
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
    private jobService: JobService,
    private interviewerService: InterviewerService,
    private location: Location
  ) {
    this.isLoading = this.loaderService.isLoading$;
  }
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
      this.selectedCandidateIds = this.filteredCandidate.map((item) => item.id);
    } else {
      this.selectedCandidateIds = [];
    }
  }
  onToggleSelection(id: string) {
    if (this.selectedCandidateIds.includes(id)) {
      this.selectedCandidateIds = this.selectedCandidateIds.filter(
        (itemId) => itemId !== id
      );
    } else {
      this.selectedCandidateIds.push(id);
    }
    this.selectedAllChecked =
      this.selectedCandidateIds.length === this.filteredCandidate.length;
  }
  loadAllJob() {
    this.loaderService.setLoading(true);
    this.jobService
      .getAllJobs()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.job = response.data;
          }
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        },
      });
  }
  loadCandidateByJobId(jobId: string) {
    this.loaderService.setLoading(true);
    this.candidateService
      .getCandidateByJobId(jobId)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.candidateData = response.data;
            this.filteredCandidate = this.candidateData;
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }

  onShorListCandidate() {
    const data = {
      ids: this.selectedCandidateIds,
    };
    if (data.ids.length > 0) {
      this.loaderService.setLoading(true);
      this.candidateService
        .shorListCandidate(data)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response) => {
            this.shortListedData = response.data;
            this.toastService.success('Shortlisted successfully');
            this.selectedCandidateIds = [];
            this.loadCandidateByJobId(this.selectedJobId);
          },
          error: (err) => {
            this.toastService.error(err.message);
          },
        });
    } else {
      this.toastService.error(
        'Please select at least one candidate before shortlisting'
      );
    }
  }
  onInterviewerFeedback() {
    const data = {
      candidateIds: this.selectedCandidateIds,
      jobId: this.selectedJobId,
    };
    if (data.candidateIds.length > 0) {
      this.loaderService.setLoading(true);
      this.interviewerService
        .feedback(data)
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          next: (response) => {
            if (response.valid && response.data) {
              this.toastService.success(response.message);
              this.selectedCandidateIds = [];
            } else {
              this.toastService.error(response.message);
              this.selectedCandidateIds = [];
            }
          },
          error: (error) => {
            this.toastService.error(error.message);
            this.selectedCandidateIds = [];
          },
        });
    } else {
      this.toastService.error('Select candidate');
    }
  }
  getCandidates() {
    this.loadCandidateByJobId(this.selectedJobId);
  }
  openScheduleModal(id: string) {
    this.CandidateViewComponent.close();
    this.CandidateScheduleDateComponent.open();
    this.candidateId = id;
  }
  openMailCandidateModal() {
    this.CandidateViewComponent.close();
    this.CandidateMailModalComponent.open();
  }
  openFilterModal() {
    this.CandidateFilterModalComponent.open();
  }
  updateCandidateData(data: Candidate[]) {
    this.candidateData = data;
  }

  onViewCandidate(id: string) {
    if (id) {
      this.candidateViewData = this.filteredCandidate.find(
        (candidate: any) => candidate.id === id
      );
      this.CandidateViewComponent.open();
    }
  }
  onScheduleDate(id: string) {
    this.scheduleModalOpen = true;
    this.candidateId = id;
    this.CandidateScheduleDateComponent.open();
  }

  onReject(id: string) {
    this.candidateId = id;
    this.CandidateRejectComponent.open();
  }

  onNavigateBack() {
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
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: (response) => {
          if (response.valid && response.data) {
            this.filteredCandidate = response.data;
            this.clearSearchFilter();
          } else {
            this.clearSearchFilter();
          }
        },
        error: (error) => {
          this.toastService.error(error.message);
          this.clearSearchFilter();
        },
      });
  }
}
