import { Injectable } from '@angular/core';
import { USER_TOKEN_KEY, UserToken } from '../model/credential';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  setToken(token: UserToken) {
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(token));
  }
  getToken() {
    return localStorage.getItem(USER_TOKEN_KEY);
  }
  removeToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
  }
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  }
}
