import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { job } from 'src/app/dashboard/job/shared/job';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';
import { CandidateLoginComponent } from '../../candidate-login/candidate-login.component';
import { CORP_URL_KEY } from 'src/app/core/model/credential';

@Component({
  selector: 'erecruit-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss'],
})
export class JobOverviewComponent implements OnInit {
  @ViewChild(CandidateLoginComponent)
  CandidateLoginComponent!: CandidateLoginComponent;
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
        localStorage.setItem(CORP_URL_KEY, encodeUrl);
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

  openModal() {
    this.CandidateLoginComponent.open();
  }
  handleBack() {
    this.location.back();
  }
}
