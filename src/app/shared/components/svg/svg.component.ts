import { Component, Input } from '@angular/core';
import { SvgTemplate, SvgTemplateAware } from './svg-template';

@Component({
  selector: 'erecruit-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss'],
})
@SvgTemplateAware
export class SvgComponent {
  public svgTemplate = SvgTemplate;

  @Input()
  template!: SvgTemplate;
}
