import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/service/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();
    const isTokenExpired = this.tokenService.isTokenExpired();
    console.log(token);
    if (!token || isTokenExpired) {
      this.tokenService.removeToken();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
