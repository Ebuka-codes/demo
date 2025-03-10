import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { Candidate } from './shared/candidate';
import { CandidateService } from './shared/candidate.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  notyf = new Notyf();
  candidateData!: Array<Candidate>;
  isLoading!: Observable<boolean>;
  filteredData!: any;
  candidateViewData: any;
  searchText!: string;
  constructor(
    public dashboardService: DashboardService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
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
    this.dashboardService.setLoading(true);
    this.isLoading = this.dashboardService.isLoading$;
    this.candidateService.getCandidate().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.candidateData = response.data;
          console.log(this.candidateData);
          this.filteredData = this.candidateData;
          this.dashboardService.setLoading(false);
        }
      },
      error: (error) => {
        this.notyf.error({
          message: error.message,
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.dashboardService.setLoading(false);
        this.isLoading = this.dashboardService.isLoading$;
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
}
