import { Component } from '@angular/core';
import { SvgTemplate } from '../svg/svg-template';

@Component({
  selector: 'erecruit-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  svgTemplate = SvgTemplate;
}
