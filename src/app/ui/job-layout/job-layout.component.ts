import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { JobRecruitService } from 'src/app/shared/service/job-recruit.service';

@Component({
  selector: 'app-job-layout',
  templateUrl: './job-layout.component.html',
  styleUrls: ['./job-layout.component.scss'],
})
export class JobLayoutComponent {
  isLoading$!: Observable<boolean>;

  constructor(private loaderService: JobRecruitService) {
    this.isLoading$ = this.loaderService.isLoading$;
    console.log(this.isLoading$.subscribe((loader) => console.log(loader)));
  }
}
