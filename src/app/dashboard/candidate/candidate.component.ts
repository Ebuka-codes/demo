import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { Candidate } from './shared/candidate';
import { CandidateService } from './shared/candidate.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  @ViewChild('viewCandidateModal') firstModal!: ElementRef;
  @ViewChild('scheduleDateModal') secondModal!: ElementRef;
  candidateData!: Array<Candidate>;
  isLoading!: Observable<boolean>;
  filteredData: Array<Candidate> = [];
  candidateViewData: any;
  searchText!: string;
  candidateId!: string;
  scheduleModalOpen: boolean = false;

  constructor(
    private toastService: ToastService,
    private loaderService: LoaderService,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.getCandidate();
  }
  handleSearch() {
    if (this.searchText.trim() === '') {
      this.filteredData = [...this.candidateData];
    } else {
      this.filteredData = this.candidateData.filter((item: any) =>
        item.jobDetail?.jobTitle
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    }
  }
  getCandidate() {
    this.loaderService.setLoading(true);
    this.isLoading = this.loaderService.isLoading$;
    this.candidateService?.getCandidate().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.candidateData = response.data;
          this.filteredData = this.candidateData.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          this.loaderService.setLoading(false);
        }
      },
      error: () => {
        this.toastService.error('Error occur');
        this.loaderService.setLoading(false);
        this.isLoading = this.loaderService.isLoading$;
      },
      complete: () => {
        console.log('Candidate data fetched');
      },
    });
  }

  openScheduleModal(id: string) {
    this.closModal('viewCandidateModal');
    const scheduleModal = new Modal(
      document.getElementById('scheduleModal') as HTMLDivElement
    );
    this.candidateId = id;
    scheduleModal.show();
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
    this.filteredData = data;
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

  handleViewCandidate(id: string) {
    if (id) {
      this.candidateViewData = this.filteredData.find(
        (candidate: any) => candidate.id === id
      );
      const viewCandidateModal =
        Modal.getInstance(
          document.getElementById('viewCandidateModal') as HTMLDivElement
        ) ||
        new Modal(
          document.getElementById('viewCandidateModal') as HTMLDivElement
        );
      console.log(id, 'me');
      viewCandidateModal.show();
    }
  }
  handleScheduleDate(id: string) {
    this.scheduleModalOpen = true;
    this.candidateId = id;
    const modal =
      Modal.getInstance(
        document.getElementById('scheduleModal') as HTMLDivElement
      ) ||
      new Modal(document.getElementById('scheduleModal') as HTMLDivElement);
    modal.show();
  }

  handleReject(id: string) {
    this.candidateId = id;
  }
}
