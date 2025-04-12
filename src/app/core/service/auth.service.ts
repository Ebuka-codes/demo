import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { CorporateDto, LoginType } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userDataSubject$ = new BehaviorSubject<any>(null);
  data$ = this.userDataSubject$.asObservable();
  constructor(private httpClient: HttpClient) {}
  setUserData(data: any) {
    this.userDataSubject$.next(data);
  }
  getUserData(): Observable<any> {
    return this.data$;
  }
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
}
