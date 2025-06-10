import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
}
