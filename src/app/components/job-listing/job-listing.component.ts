import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnChanges {
  @Input() jobsList: any[] = [];
  @Input() text: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobsList']) {
      this.jobsList = changes['jobsList'].currentValue;
      console.log(this.jobsList);
    }
  }
}
