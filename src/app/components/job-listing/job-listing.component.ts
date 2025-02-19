import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { JobRecruitService } from 'src/app/shared/job-recruit.service';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnChanges {
  @Input() jobList: any[] = [];
  @Input() isLoading!: Observable<boolean>;
  constructor(private _jobService: JobRecruitService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobsList']) {
      this.jobList = changes['jobList'].currentValue;
    }
    this.isLoading = this._jobService.isLoading$;
  }
}
