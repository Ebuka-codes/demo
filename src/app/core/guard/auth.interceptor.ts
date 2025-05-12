import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { enviroments } from 'src/environments/enviorments';
import { TokenService } from '../service/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private router: Router) {}
  baseUrl = enviroments.API_URL;
  private shouldIncludeCorpkey: string[] = [`${this.baseUrl}/user/find`];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.tokenService.getToken();
    let access_token = '';
    const corpKey = localStorage.getItem('corp-key') || '';
    const header: { [header: string]: string } = {};
    try {
      const parsedToken = token ? JSON.parse(token) : null;
      access_token = parsedToken?.access_token || '';
    } catch (error) {
      console.error('Error parsing token:', error);
    }

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
    let modifiedReq = req;
    if (access_token) {
      header['Authorization'] = `Bearer ${access_token}`;
    }
    const shouldAddCorpkey = !this.shouldIncludeCorpkey.some((url) => {
      req.url.includes(url);
    });

    if (corpKey && shouldAddCorpkey) {
      header['corp-key'] = btoa(corpKey);
    }
    modifiedReq = req.clone({
      setHeaders: header,
    });

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.tokenService.removeToken();
          this.router.navigate(['/session']);
          return throwError(() => 'Session expired');
        }
        return throwError(() => error);
      })
    );
  }
}
