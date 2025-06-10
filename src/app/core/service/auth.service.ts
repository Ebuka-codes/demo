import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { CorporateDto, LoginType } from '../model/auth';
import { UserProfile } from '../model/credential';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profileSubject$ = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject$.asObservable();
  loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();
  constructor(private httpClient: HttpClient) {}

  generateOtp(data: any) {
    return this.httpClient.post(Constants.AUTH_URL.VERIFICATION_OTP, data);
  }
  signUp(corpaorate: CorporateDto) {
    return this.httpClient.post(Constants.AUTH_URL.SIGNUP, corpaorate);
  }
  login(data: LoginType) {
    return this.httpClient.post(Constants.AUTH_URL.LOGIN, data);
  }

  logout(refreshToken: string | undefined) {
    return this.httpClient.post(Constants.AUTH_URL.LOGOUT, {
      refresh_token: refreshToken,
    });
  }
  loadUserProfile(): Observable<UserProfile> {
    this.loadingSubject$.next(true);
    return this.httpClient
      .get<UserProfile>(Constants.USER_URL.USER + '/profile')
      .pipe(
        tap((response: any) => {
          this.profileSubject$.next(response.data);
          this.loadingSubject$.next(false);
        }),
        catchError((error) => {
          this.loadingSubject$.next(false);
          return throwError(() => error);
        })
      );
  }
}
