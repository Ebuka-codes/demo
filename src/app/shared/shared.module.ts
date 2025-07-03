import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountFormatDirective } from './directives/amount-format.directive';
import { FullPageLoaderSpinnerComponent } from './components/full-page-loader-spinner/full-page-loader-spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { monthYearFormatDirective } from './directives/month-date-format.directive';
import { ButtonModule } from './components/button/button.module';
import { SvgModule } from './components/svg/svg.module';
import { PrivacyPolicyModalComponent } from './components/privacy-policy-modal/privacy-policy-modal.component';
import { LoaderSpinnerComponent } from './components/loader-spinner/loader-spinner.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';

const COMPONENTS: any[] = [
  FullPageLoaderSpinnerComponent,
  FooterComponent,
  HeaderComponent,
  PrivacyPolicyModalComponent,
  LoaderSpinnerComponent,
  LoadingBarComponent,
];
const DIRECTIVES: any[] = [AmountFormatDirective, monthYearFormatDirective];

const MODULES: any[] = [CommonModule, RouterModule, ButtonModule, SvgModule];

@NgModule({
  declarations: [...DIRECTIVES, ...COMPONENTS, PrivacyPolicyModalComponent],
  imports: [...MODULES],
  exports: [...DIRECTIVES, ...COMPONENTS, ...MODULES],
})
export class SharedModule {}
