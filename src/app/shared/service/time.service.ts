import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private timeSubject = new BehaviorSubject<string>(this.getCurrentTime());
  time$ = this.timeSubject.asObservable();

  constructor() {
    interval(1000).subscribe(() => {
      this.timeSubject.next(this.getCurrentTime());
    });
  }

  private getCurrentTime(): string {
    const now = new Date();
    let hours = now.getHours() % 12 || 12;
    let minutes = now.getMinutes();
    const period = now.getHours() >= 12 ? 'PM' : 'AM';

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  }
}
