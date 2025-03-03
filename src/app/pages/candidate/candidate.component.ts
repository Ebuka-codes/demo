import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { CandidateInfo } from 'src/app/shared/type';

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
  constructor(private jobService: JobRecruitService) {}

  ngOnInit(): void {
    this.getCandidate();
  }
  getCandidate() {
    this.jobService.setLoading(true);
    this.isLoading = this.jobService.isLoading$;
    this.dataLoading = true;
    this.jobService.getCandidate().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.candidateData = response.data;
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
}
