import { Component } from '@angular/core';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  date = new Date();
  currentHour = this.date.getHours() % 12 || 12;
  currentMinute = this.date.getMinutes();
  sec = 0;
  period = this.date.getHours() >= 12 ? 'PM' : 'AM';
  time = `${this.currentHour}:${this.currentMinute}${this.period}`;

  constructor(private toaster: ToastService) {
    console.log(this.currentHour, this.currentMinute, this.period);
    setInterval(() => {
      this.sec++;
      if (this.sec === 60) {
        this.sec = 0;
        this.currentMinute++;
        if (this.currentMinute === 60) {
          this.currentMinute = 0;
          this.currentHour++;
          if (this.currentHour === 12) {
            this.currentHour = 0;
          }
          this.period = this.currentHour >= 12 ? 'PM' : 'AM';
        }
      }
      this.time = `${this.currentHour
        .toString()
        .padStart(2, '0')}:${this.currentMinute.toString().padStart(2, '0')}${
        this.period
      }`;
    }, 1000);
  }
}
