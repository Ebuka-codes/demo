import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilService } from '../service/util.service';
import {
  CURRENT_CORPORATE_KEY,
  UserToken,
} from 'src/app/shared/model/credential';
import { ApplicationContext } from '../context/application-context';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  baseUrl = environment.API_URL;
  private shouldIncludeCorpkey: string[] = [`${this.baseUrl}/user/find`];
  private userToken: UserToken;

  public openApiUrls = ['/login', '/logout', '/signup', '/verify-email'];

  constructor(
    private utilService: UtilService,
    private applicationContext: ApplicationContext
  ) {
    this.init();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const hasAuth = req.headers.has('Authorization');

    const corpKey = localStorage.getItem(CURRENT_CORPORATE_KEY) || '';

    //unprotected route
    if (
      req.url.includes('/login') ||
      req.url.includes('/verify-email') ||
      req.url.includes('/apply/') ||
      req.url.includes('/job-listing/') ||
      req.url.includes('/candidates/exists') ||
      req.url.includes('/auth/common/job/')
    ) {
      return next.handle(req);
    }

    if (localStorage.getItem(CURRENT_CORPORATE_KEY)) {
      req = req.clone({
        setHeaders: {
          'corp-key': localStorage.getItem(CURRENT_CORPORATE_KEY),
        },
      });
    }

    if (!hasAuth && this.userToken && this.applicationContext.getUserToken()) {
      if (
        this.applicationContext.getUserToken().expiration &&
        this.userToken.expires_in &&
        this.userToken.expires_in <= Date.now()
      ) {
        return this.handleError(req, next, { status: 401 });
      }

      req = this.authRequest(req);
    }

    const shouldAddCorpkey = !this.shouldIncludeCorpkey.some((url) => {
      req.url.includes(url);
    });

    if (corpKey && shouldAddCorpkey) {
      req = req.clone({
        setHeaders: {
          'corp-key': btoa(corpKey),
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const invalidSessionError = error;

        if (
          !req.headers.has('Authorization') &&
          !(this.openApiUrls.findIndex((obj) => obj == req.url) > -1)
        ) {
          return this.handleError(req, next, error);
        }

        if (invalidSessionError && invalidSessionError.status === 401) {
          return this.handleError(req, next, error);
        }
        return throwError(() => error);
      })
    );
  }

  private init(): void {
    this.applicationContext.onUserToken((userToken) => {
      this.userToken = userToken;
    });
  }

  private authRequest(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${this.userToken.access_token}` },
    });
  }
  private handleError(
    request: HttpRequest<any>,
    next: HttpHandler,
    error: any
  ): Observable<any> {
    try {
      if (error.status === 401) {
        this.logout('INVALID_SESSION');
      }
    } catch (error) {
      console.log(error);
    }
    return throwError(error);
  }
  private logout(value: string) {
    this.utilService.tokenExpireSubject.next({ error: true, errorCode: value });
    return;
  }
}
