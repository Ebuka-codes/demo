import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'erecruit-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent implements OnInit {
  progress = 0;
  private sub: Subscription | null = null;

  @Input() loading!: boolean | null;

  @Input() customBg!: boolean;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      console.log(this.loading, 'me');
      if (this.loading) {
        this.startProgress();
      } else {
        this.completeProgress();
      }
    }
  }
  startProgress() {
    this.progress = 0;
    this.sub = interval(200).subscribe(() => {
      if (this.progress < 90) {
        this.progress += Math.random() * 10;
      }
    });
  }

  completeProgress() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.progress = 100;
    setTimeout(() => {
      this.progress = 0;
    }, 500);
  }
}
