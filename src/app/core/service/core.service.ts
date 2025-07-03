import { Injectable } from '@angular/core';
import {
  CURRENT_CORPORATE_KEY,
  IUserToken,
  LoginRequest,
  USER_TOKEN_KEY,
  UserProfile,
  UserToken,
} from '../../shared/model/credential';
import {
  catchError,
  lastValueFrom,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { ApplicationContext } from '../context/application-context';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/app/utils/constants';
import { DataResponse } from 'src/app/shared/model/data-response';
import { CorporateDto } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(
    private applicationContext: ApplicationContext,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  signUp(corpaorate: CorporateDto) {
    return this.httpClient.post(Constants.AUTH_URL.SIGNUP, corpaorate);
  }

  logoutSession(refreshToken) {
    return this.httpClient.post(Constants.AUTH_URL.LOGOUT, {
      refresh_token: refreshToken,
    });
  }
  logout() {
    this.applicationContext.loggedIn = false;

    if (this.applicationContext.userProfile) {
      this.applicationContext.userProfile = null;
    }

    if (this.applicationContext.userToken) {
      this.applicationContext.userToken = null;
    }
  }

  login(m: LoginRequest): Observable<DataResponse<UserToken>> {
    return this.httpClient
      .post<DataResponse<UserToken>>(Constants.AUTH_URL.LOGIN, m, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response) => {
          this.extractUserToken(response);
        })
      );
  }

  extractUserToken(response: DataResponse<UserToken>): UserToken {
    let userToken: UserToken =
      response && response.valid && response.data ? response.data : null;
    userToken = userToken
      ? Object.assign(new IUserToken(), userToken)
      : userToken;
    if (userToken && userToken.access_token) {
      if (userToken.expires_in) {
        userToken.expiration = Date.now() + userToken.expires_in * 1000;
      }
      response.data = userToken;
    }
    return null;
  }

  async loadApplicationContext() {
    console.log('Loading application Context');

    let profile: any = null;
    let token: UserToken = null;

    try {
      const userToken = await lastValueFrom(this.loadUserToken());

      if (!userToken) {
        throw new Error('No user token found');
      }

      token = userToken;

      profile = await lastValueFrom(this.loadUserProfile(token));

      console.log(profile);

      localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(token));

      // Update application context
      this.applicationContext.userToken = token;
      this.applicationContext.userProfile = profile;
      this.applicationContext.loggedIn = true;

      // Call onloadComplete with true indicating success
      this.onloadComplete(true);
    } catch (error) {
      console.error('LoadApplicationContextError:', error);

      this.onloadComplete(false);
    }
  }

  loadUserToken(): Observable<UserToken> {
    const userTokenJson = localStorage.getItem(USER_TOKEN_KEY);
    if (userTokenJson) {
      try {
        const userToken: UserToken = JSON.parse(userTokenJson);
        console.log(userToken);
        if (userToken && userToken.access_token) {
          return of(userToken);
        }
      } catch (ex) {
        console.log(ex);
      }
    }
    console.log('userTokenJson', userTokenJson);
    return throwError({});
  }
  private onloadComplete(loggedInSuccessful: boolean) {
    if (window['pleaseWait']) {
      setTimeout(() => {
        window['pleaseWait'].finish();
      }, 1000);
    }

    if (!loggedInSuccessful && !this.applicationContext.isLoggedIn()) {
      this.removeSessionKey();
      this.logout();
    }
  }
  loadUserProfile(userToken: UserToken): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(
      Constants.USER_URL.USER + '/profile',
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${userToken.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      }
    );
  }

  loginEvent(userToken: UserToken): Observable<UserProfile> {
    return Observable.create((o) => {
      this.loadUserProfile(userToken)
        .pipe(
          catchError((error) => {
            o.error(error);
            return throwError(error);
          })
        )
        .subscribe((userProfile) => {
          if (userProfile && userToken) {
            console.log(userProfile, userToken);
            localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(userToken));
            this.applicationContext.userToken = userToken;
            this.applicationContext.userProfile = userProfile;
            this.applicationContext.loggedIn = true;
            o.next(userProfile);
          } else {
            o.error(null);
          }
        });
    });
  }

  isTokenExpired(): boolean {
    const token = this.applicationContext.getUserToken()?.access_token;
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  }

  removeSessionKey() {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(CURRENT_CORPORATE_KEY);
  }
}

export function ApplicationContextFactory(service: CoreService): Function {
  return () => service.loadApplicationContext();
}
