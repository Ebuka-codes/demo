import { Component, AfterViewInit } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss'],
})
export class InterviewsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    flatpickr('#calendar', {
      inline: true,
      enableTime: false,
      defaultDate: new Date(),
    });
  }
}
