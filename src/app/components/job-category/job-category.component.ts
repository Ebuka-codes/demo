import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class JobCategoryComponent {
  @Input() jobCategory: any[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobCategory']) {
      this.jobCategory = changes['jobCategory'].currentValue;
    }
  }

  selectedJobTypes: string[] = [];

  toggleJobType(type: string) {
    const index = this.selectedJobTypes.indexOf(type);

    if (index !== -1) {
      this.selectedJobTypes.splice(index, 1);
    } else {
      this.selectedJobTypes.push(type);
    }
    console.log('Updated selectedJobTypes:', this.selectedJobTypes);
    this.filterChanged.emit([...this.selectedJobTypes]);

    // if (this.selectedJobTypes.includes(type)) {
    //   this.selectedJobTypes = this.selectedJobTypes.filter((t) => t !== type);
    // } else {
    //   this.selectedJobTypes.push(type);
    // }
    // this.filterChanged.emit(this.selectedJobTypes);
  }
}
