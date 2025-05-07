import { Component, Input } from '@angular/core';
import { Corporate } from '../shared/corporate';

@Component({
  selector: 'erecruit-corporate-view',
  templateUrl: './corporate-view.component.html',
  styleUrls: ['./corporate-view.component.scss'],
})
export class CorporateViewComponent {
  @Input() corporateViewData!: Corporate;
}
