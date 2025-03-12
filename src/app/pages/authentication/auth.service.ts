import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}
  login(email: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(this.baseUrl + `candidates/exists/${email}`, {
      headers,
    });
  }
  getLoggedInUserData(email: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      this.baseUrl + `candidates/get-candidate-by-email/${email}`,
      {
        headers,
      }
    );
  }
}
