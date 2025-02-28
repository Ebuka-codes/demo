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
  @Input() isLoadingSearch: any;
  start: number = 0;
  end: number = 6;
  constructor(private jobService: JobRecruitService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobsList']) {
      this.jobList = changes['jobList'].currentValue;
    }
    this.isLoading = this.jobService.isLoading$;
  }

  ngOnInit(): void {}

  showJobList() {
    this.end = this.end * 2;
  }
}
