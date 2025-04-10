import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-job-layout',
  templateUrl: './job-layout.component.html',
  styleUrls: ['./job-layout.component.scss'],
})
export class JobLayoutComponent {
  isLoading!: boolean;
  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading$.subscribe((loading) => {
      loading = loading;
    });
  }
}
