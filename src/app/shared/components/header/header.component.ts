import { Component } from '@angular/core';
import { SvgTemplate } from '../svg/svg-template';

@Component({
  selector: 'erecruit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  svgTemplate = SvgTemplate;
}
