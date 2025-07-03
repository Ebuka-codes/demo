import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../service/core.service';
import { ApplicationContext } from '../context/application-context';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private coreService: CoreService,
    private applicationContext: ApplicationContext,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.applicationContext.getUserToken();
    if (!token) {
      this.coreService.removeSessionKey();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
