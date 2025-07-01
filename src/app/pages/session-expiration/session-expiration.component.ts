import { Component } from '@angular/core';
import { SvgTemplate } from 'src/app/shared/components/svg/svg-template';

@Component({
  selector: 'erecruit-session',
  templateUrl: './session-expiration.component.html',
  styleUrls: ['./session-expiration.component.scss'],
})
export class SessionExpirationComponent {
  svgTemplate = SvgTemplate;
}
