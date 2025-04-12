import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private returnUrlKey = 'returnUrl';

  setReturnUrl(url: string) {
    sessionStorage.setItem(this.returnUrlKey, url);
  }

  getReturnUrl(): string | null {
    return sessionStorage.getItem(this.returnUrlKey);
  }

  goToReturnUrl(router: Router) {
    const returnUrl = this.getReturnUrl();
    if (returnUrl) {
      router.navigateByUrl(returnUrl);
    } else {
      router.navigateByUrl('/');
    }
  }

  clearReturnUrl() {
    sessionStorage.removeItem(this.returnUrlKey);
  }
}
