import { Component, Input, OnInit } from '@angular/core';
import { ButtonConfig } from './button';

@Component({
  selector: 'erecruit-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() buttonConfig: ButtonConfig = {
    text: 'button',
    type: 'button',
    customClass: 'primary-btn small-btn',
    isDisabled: false,
    icon: '',
    isLoading: false,
  };
  constructor() {}
  ngOnInit(): void {}
}
