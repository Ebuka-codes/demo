import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth.service';
import { CorporateService } from '../../corporate/shared/corporate.service';
import { CORP_URL } from 'src/app/core/model/credential';
import { ToastService } from 'src/app/core/service/toast.service';
import { UtilService } from 'src/app/core/service/util.service';

@Component({
  selector: 'erecruit-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent {
  isLoading: boolean = false;
  customLoaderBg = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private utilService: UtilService
  ) {}
  ngOnInit() {
    this.authService.loadUserProfile().subscribe();
    this.loadEncodeUrl();
  }
  loadEncodeUrl() {
    this.utilService.generateEndcodeUrl().subscribe({
      next: (response) => {
        if (response.valid) {
          localStorage.setItem(CORP_URL, response.data);
        } else {
          this.toastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message);
      },
    });
  }
}
