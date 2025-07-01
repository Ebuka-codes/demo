import { NgModule } from '@angular/core';
import { SvgComponent } from './svg.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SvgComponent],
  imports: [CommonModule],
  exports: [SvgComponent],
})
export class SvgModule {}
