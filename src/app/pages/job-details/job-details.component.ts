import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JobRecruitService } from '../../shared/job-recruit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { job } from 'src/app/shared/type';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  id: any;
  minDate: any;
  isLoading: boolean = false;
  errorMessage: string = '';
  id$!: Observable<string | null>;
  data!: job;
  selectedResumeFile!: string | null;
  selectedCoverLetterFile!: string | null;
  constructor(
    private jobService: JobRecruitService,
    private routes: ActivatedRoute,
    private navigateRoute: Router,
    private loaction: Location
  ) {}
  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log(id);
      this.getJobDetailsById(id);
    });
  }
  getJobDetailsById(id: string) {
    this.isLoading = true;
    this.jobService.getJobDetailsById(id).subscribe({
      next: (response) => {
        if (response.valid && response.data) {
          this.data = response.data;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }
  handleApplyJob() {
    localStorage.setItem('JobId', this.data?.id);
    this.navigateRoute.navigateByUrl('/auth/login', { replaceUrl: true });
  }
  handleBack() {
    this.loaction.back();
  }
}
