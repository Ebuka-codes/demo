import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private httpClient: HttpClient) {}
  createUserRole(data: any) {
    return this.httpClient.post(Constants.USER_URL.USER_ROLE, data);
  }
}
