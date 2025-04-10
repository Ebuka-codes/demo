import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../shared/service/loader.service';
import { DashboardService } from './dashboard.service';
import { ToastService } from '../shared/service/toast.service';
import { UserService } from './user/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isLoading$!: Observable<boolean>;
  constructor(
    private loaderService: LoaderService,
    private userService: UserService,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    this.loaderService.setLoading(true);
    this.isLoading$ = this.loaderService.isLoading$;
    this.userService.loadUserProfile().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.loaderService.setLoading(false);
          this.isLoading$ = this.loaderService.isLoading$;
          this.userService.setUserProfile(response.data);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
        this.loaderService.setLoading(false);
        this.isLoading$ = this.loaderService.isLoading$;
      },
    });
  }
}
