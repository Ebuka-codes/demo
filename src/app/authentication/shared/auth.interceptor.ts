import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/service/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.tokenService.getToken();
    let access_token = '';
    try {
      const parsedToken = token ? JSON.parse(token) : null;
      access_token = parsedToken?.access_token || '';
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    const corpValue = localStorage.getItem('corp-key') || '';

    // Skip interceptor for login or verify-email routes
    if (req.url.includes('/login') || req.url.includes('/verify-email')) {
      return next.handle(req);
    }

    let modifiedReq = req;

    if (access_token) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`,
          'corp-key': btoa(corpValue),
          'Content-Type': 'application/json',
        },
        headers: req.headers.delete('corp-key'),
      });
    }

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.tokenService.removeToken();
          this.router.navigate(['/session']);
          console.warn('Session expired, redirecting to session page.');
        }
        return throwError(() => new Error('Session expired'));
      })
    );
  }
}
