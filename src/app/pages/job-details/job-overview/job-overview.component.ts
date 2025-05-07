import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { job } from 'src/app/shared/type';

@Component({
  selector: 'erecruit-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss'],
})
export class JobOverviewComponent implements OnInit {
  jobData!: job;
  isLoading!: boolean;
  tabs: string[] = ['Overview', 'Application'];
  activeTag = 'Overview';
  constructor(
    private jobService: JobRecruitService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.jobService.jobDetailData$.subscribe((data) => {
      this.jobData = data;
    });
  }
  toggletabs(tab: string) {
    if (tab === 'Overview') {
      this.activeTag = 'Overview';
    } else {
      this.activeTag = 'Application';
    }
  }
  // getJobDetailsById(id: string) {
  //   this.isLoading = true;
  //   this.jobService.getJobDetailsById(id).subscribe({
  //     next: (response) => {
  //       if (response.valid && response.data) {
  //         this.jobData = response.data;
  //         this.isLoading = false;
  //       } else {
  //         this.isLoading = false;
  //       }
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //     },
  //   });
  // }
  handleBack() {
    this.location.back();
  }
}
