import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './guard/auth-guard.service';
import { AuthInterceptor } from './guard/auth.interceptor';
import { ToastService } from './service/toast.service';
import { UtilService } from './service/util.service';
import { ApplicationContext } from './context/application-context';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const PROVIDERS: any[] = [
  AuthService,
  ToastService,
  UtilService,
  AuthGuard,
  ApplicationContext,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];

@NgModule({
  imports: [RouterModule, CommonModule, HttpClientModule],
  providers: [...PROVIDERS],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...PROVIDERS],
    };
  }

  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule'
      );
    }
  }
}
