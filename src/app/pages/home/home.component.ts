import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  error$!: Observable<any>;
  constructor(private _jobService: JobRecruitService) {}
  ngOnInit(): void {
    this._jobService.getJobList().subscribe((data) => {
      this.jobList = data;
    });
    this._jobService.getJobType().subscribe((data) => {
      this.jobCategory = data;
    });
    this.isLoading = this._jobService.isLoading$;
    this.error$ = this._jobService.error$;
  }
}
