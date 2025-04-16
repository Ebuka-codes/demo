import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountFormatDirective } from './directives/amount-format.directive';

@NgModule({
  declarations: [AmountFormatDirective],
  imports: [CommonModule],
  exports: [AmountFormatDirective],
})
export class SharedModule {}
