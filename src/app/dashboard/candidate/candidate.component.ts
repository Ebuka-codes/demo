import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { CandidateInfo } from 'src/app/shared/type';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {
  notyf = new Notyf();
  candidateData!: Array<CandidateInfo>;
  isLoading!: Observable<boolean>;
  dataLoading: boolean = false;
  filteredData!: any;
  viewData: any;
  searchText!: string;
  constructor(private jobService: DashboardService) {}

  ngOnInit(): void {
    this.getCandidate();
  }

  handleSearch() {
    console.log(this.searchText);
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
    this.jobService.setLoading(true);
    this.dataLoading = true;
    this.jobService.getCandidate().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.candidateData = response.data;
          this.filteredData = this.candidateData;
          this.jobService.setLoading(false);
          this.dataLoading = false;
        }
      },
      error: (error) => {
        this.notyf.error({
          message: error.error.message,
          duration: 4000,
          position: { x: 'right', y: 'top' },
        });
        this.jobService.setLoading(false);
        this.dataLoading = false;
      },
      complete: () => {
        console.log('Candidate data fetched');
      },
    });
  }

  handleViewCandidate(value: string) {
    if (value) {
      this.viewData = this.filteredData.find(
        (candidate: any) => candidate.id === value
      );
      console.log(this.viewData);
    }
  }
}
