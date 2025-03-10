import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const corpValue = localStorage.getItem('corp-key') || '';

    if (req.headers.has('corp-key')) {
      const modifiedReq = req.clone({
        setHeaders: {
          'corp-key': btoa(corpValue),
        },
        headers: req.headers.delete('corp-key'),
      });

      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
  constructor() {}
}
