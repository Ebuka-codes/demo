import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './guard/auth-guard.service';
import { AuthInterceptor } from './guard/auth.interceptor';
import { ToastService } from './service/toast.service';
import { UtilService } from './service/util.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AuthService,
    ToastService,
    UtilService,
    AuthGuard,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule'
      );
    }
  }
}
