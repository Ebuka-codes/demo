import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[amountFormat]',
})
export class AmountFormatDirective {
  constructor(private renderer: Renderer2, private control: NgControl) {}
  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const rawValue = input.value.replace(/,/g, '');

    if (!/^\d*$/.test(rawValue)) return;

    this.control.control?.setValue(rawValue, { emitEvent: false });
    setTimeout(() => {
      const formatted = this.formatNumber(rawValue);
      this.renderer.setProperty(input, 'value', formatted);
    });
  }
  formatNumber(value: string): string {
    if (!value) return '';
    return Number(value).toLocaleString('en-US');
  }
}
