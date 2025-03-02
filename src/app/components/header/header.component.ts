import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() onSearchInput = new EventEmitter();
  inputValue: any;

  search() {
    if (this.inputValue) {
      this.onSearchInput.emit(this.inputValue);
    }
  }
  handleEnter(value: any) {
    if (this.inputValue) {
      this.onSearchInput.emit(value);
    }
  }
}
