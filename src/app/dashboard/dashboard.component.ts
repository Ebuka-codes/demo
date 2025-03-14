import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { LoaderService } from '../shared/service/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isLoading!: Observable<any>;
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading$;
  }
}
