import { Component } from '@angular/core';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private toaster: ToastService) {}
  text() {
    this.toaster.success('working');
  }
}
