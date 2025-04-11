import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSubject$ = new BehaviorSubject<any>(null);
  user$ = this.userSubject$.asObservable();
  constructor(private httpClient: HttpClient) {}
  createUser(data: any) {
    return this.httpClient.post(Constants.USER_URL.USER + '/register', data);
  }
  getUserRole() {
    return this.httpClient.get(Constants.USER_URL.USER_ROLE);
  }
  getAllUsers() {
    return this.httpClient.get(Constants.USER_URL.USER + '/find');
  }

  loadUserProfile() {
    return this.httpClient.get(Constants.USER_URL.USER + '/profile');
  }
  setUserProfile(user: any) {
    this.userSubject$.next(user);
  }
  getUserProfile() {
    return this.user$;
  }
}
