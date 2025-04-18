import { Component } from '@angular/core';
import { TimeService } from 'src/app/shared/service/time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  currentHour!: number;
  currentMinute!: number;
  sec!: number;
  period!: string;
  time: string = '';
  timer: any;

  constructor(private timeService: TimeService) {
    this.timeService.time$.subscribe((val) => {
      this.time = val;
    });

    console.log('Header init');
  }
}
