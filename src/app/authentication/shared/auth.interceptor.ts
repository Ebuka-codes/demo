import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = this.authService.getToken();
    let access_token = '';

    try {
      const parsedToken = token ? JSON.parse(token) : null;
      access_token = parsedToken?.access_token || '';
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    const corpValue = localStorage.getItem('corp-key') || '';
    if (token) {
      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`,
          'corp-key': btoa(corpValue),
          'Content-Type': 'application/json',
        },
        headers: req.headers.delete('corp-key'),
      });
      console.log('Request Headers:', req.headers);
      return next.handle(modifiedReq);
    } else {
      return next.handle(req);
    }
  }
}
