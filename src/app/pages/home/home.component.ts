import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { jobType } from 'src/app/shared/type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  jobList!: jobType[];
  jobCategory!: string[];
  isLoading!: Observable<boolean>;
  isLoadingSearch: boolean = false;
  error$!: Observable<any>;
  searchInput: string = '';
  private notyf = new Notyf();
  constructor(private _jobService: JobRecruitService) {}
  ngOnInit(): void {
    this._jobService.getJobList().subscribe((data) => {
      this.jobList = data;
    });
    this._jobService.getJobType().subscribe((data) => {
      this.jobCategory = data;
    });
    this.isLoading = this._jobService.isLoading$;
  }

  onSearchInput(value: any) {
    this.searchInput = value;
    this.isLoadingSearch = true;
    this._jobService
      .searchJobs(this.searchInput.trim())
      .subscribe((response) => {
        if (response.valid && response.data) {
          this.jobList = response.data;
          this.isLoadingSearch = false;
        } else {
          this.notyf.error('No Jobs Found');
          this.jobList = [];
        }
      });
  }

  onFilterChange(selectedJobTypes: string[]) {
    console.log(this.jobList);
    if (selectedJobTypes.length === 0) {
      this.jobList = [...this.jobList];
      return;
    }
    this.jobList = this.jobList.filter((job) =>
      selectedJobTypes.includes(job.jobType)
    );

    console.log('Filtered Jobs:', this.jobList);
  }
}
