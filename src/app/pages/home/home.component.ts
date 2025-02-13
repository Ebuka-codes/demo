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
  jobsList!: jobType[];
  isLoading$!: Observable<boolean>;
  text: string = 'ebuka';
  error$!: Observable<any>;
  constructor(private _jobService: JobRecruitService) {}
  ngOnInit(): void {
    this._jobService.getJobList().subscribe((data) => {
      this.jobsList = data;
    });
    this.isLoading$ = this._jobService.isLoading$;
    this.error$ = this._jobService.error$;
  }
}
