import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { Candidate } from './shared/candidate';
import { CandidateService } from './shared/candidate.service';
import { ToastService } from 'src/app/shared/service/toast.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  notyf = new Notyf();
  candidateData!: Array<Candidate>;
  isLoading!: Observable<boolean>;
  filteredData: Array<Candidate> = [];
  candidateViewData: any;
  searchText!: string;
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
          this.filteredData = this.candidateData;
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
  handleViewCandidate(id: string) {
    if (id) {
      this.candidateViewData = this.filteredData.find(
        (candidate: any) => candidate.id === id
      );
    }
  }
  handleUpdateCandidateTable() {
    this.getCandidate();
  }

  handleReject(id: string) {
    this.loaderService.setLoading(true);
    this.candidateService
      .rejectCandidateById(id, { status: 'REJECTED' })
      .subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.getCandidate();
          this.loaderService.setLoading(false);
        },
        error: () => {
          this.toastService.error('Error rejecting Candidate!');
        },
      });
  }
}
