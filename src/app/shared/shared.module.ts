import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountFormatDirective } from './directives/amount-format.directive';
import { FullPageLoaderSpinnerComponent } from './components/full-page-loader-spinner/full-page-loader-spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoaderSpinnerComponent } from './components/loader-spinner/loader-spinner.component';
import { RouterModule } from '@angular/router';
import { monthYearFormatDirective } from './directives/month-date-format.directive';

const COMPONENTS: any[] = [
  FullPageLoaderSpinnerComponent,
  FooterComponent,
  HeaderComponent,
  LoaderSpinnerComponent,
];
const DIRECTIVES: any[] = [AmountFormatDirective, monthYearFormatDirective];

const MODULES: any[] = [CommonModule, RouterModule];
@NgModule({
  declarations: [...DIRECTIVES, ...COMPONENTS],
  imports: [...MODULES],
  exports: [...DIRECTIVES, ...COMPONENTS],
})
export class SharedModule {}
