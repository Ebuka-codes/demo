import {
  ChangeDetectionStrategy,
  Component,
  Input,
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
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobCategory']) {
      this.jobCategory = changes['jobCategory'].currentValue;
    }
  }
}
