import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/utils/constants';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}
  login(email: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(
      Constants.CANDIDATE_URL.CANDIDATES + `/exists/${email}`,
      {
        headers,
      }
    );
  }
  getLoggedInUserData(email: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      Constants.CANDIDATE_URL.CANDIDATES + `/get-candidate-by-email/${email}`,
      {
        headers,
      }
    );
  }
}
