import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isLoading!: Observable<any>;
  constructor(private jobService: DashboardService) {}
  ngOnInit(): void {
    this.isLoading = this.jobService.isLoading$;
  }
}
