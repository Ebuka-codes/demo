import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../shared/service/loader.service';
import { UserService } from './user/user.service';
import { ToastService } from '../core/service/toast.service';
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
    this.userService.loadUserProfile().subscribe({
      next: (response: any) => {
        if (response.valid && response.data) {
          this.userService.setUserProfile(response.data);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
      },
    });

    this.isLoading$ = this.loaderService.isLoading$;
  }
}
