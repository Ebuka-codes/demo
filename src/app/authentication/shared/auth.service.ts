import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CorporateDto, LoginType } from './auth';
import { Constants } from 'src/app/utils/constants';
import { USER_TOKEN_KEY } from './credential';

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
  getToken() {
    return localStorage.getItem(USER_TOKEN_KEY);
  }
}
