import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const encodeUrl = params['corpUrl'];
      if (encodeUrl) {
        localStorage.setItem('corp-url', encodeUrl);
      }
    });
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
  handleBack() {
    this.location.back();
  }
}
