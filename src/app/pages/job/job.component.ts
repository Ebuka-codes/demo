import { Component, OnInit } from '@angular/core';
import { Notyf } from 'notyf';
import { Observable } from 'rxjs';
import { months } from 'src/app/shared/constants';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';
import { job } from 'src/app/shared/type';

@Component({
  selector: 'app-home',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobList!: Array<job>;
  jobCategory!: any[];
  isLoading!: Observable<boolean>;
  isLoadingSearch: boolean = false;
  error$!: Observable<any>;
  searchInput: string = '';
  private notyf = new Notyf();
  selectedJobTypes: string[] = [];
  minData: number = 0;
  maxData: number = 8;

  constructor(private _jobService: JobRecruitService) {}
  ngOnInit(): void {
    this._jobService.getJobList().subscribe((data) => {
      this.jobList = data;
      this.jobCategory = Array.from(
        new Set(
          this.jobList
            ?.filter((job: any) => job.jobType)
            .map((job: any) => job.jobType)
        )
      );
    });
    this.isLoading = this._jobService.isLoading$;
  }

  searchJob() {
    if (this.searchInput) {
      this.onSearchInput(this.searchInput);
    }
  }

  handleEnter(value: any) {
    if (this.searchInput) {
      this.searchInput = value;
      this.onSearchInput(this.searchInput);
    }
  }
  onSearchInput(value: any) {
    this.searchInput = value;
    this.isLoadingSearch = true;
    this._jobService
      .searchJobs(this.searchInput.trim())
      .subscribe((response) => {
        if (response.valid && response.data) {
          this.jobList = response.data;
          this.jobCategory = this.jobList?.filter((job: any) => job.jobType);
          this.isLoadingSearch = false;
        } else {
          this.notyf.error('No Jobs Found');
          this.jobList = [];
        }
      });
  }
  onFilterChange(selectedJobTypes: string[]) {
    this.isLoadingSearch = true;
    if (selectedJobTypes.length === 0) {
      this._jobService.getJobList().subscribe((data) => {
        this.jobList = data;
        this.isLoadingSearch = false;
      });
      return;
    }
    this._jobService.filterJobs(selectedJobTypes).subscribe((response) => {
      if (response.valid && response.data) {
        this.jobList = response.data;
        this.isLoadingSearch = false;
      } else {
        this.notyf.error('No Jobs Found');
        this.jobList = [];
        this.isLoadingSearch = false;
      }
    });
  }

  toggleJobType(type: string) {
    const index = this.selectedJobTypes.indexOf(type);
    if (index !== -1) {
      this.selectedJobTypes.splice(index, 1);
    } else {
      this.selectedJobTypes.push(type);
    }
    this.onFilterChange([...this.selectedJobTypes]);
  }
  showJobList() {
    this.maxData = this.maxData += 8;
  }

  formatDate(value: string) {
    const date = new Date(value);
    return `${date.getDate()} ${
      months[date.getMonth() + 1]
    } ${date.getFullYear()}`;
  }
}
