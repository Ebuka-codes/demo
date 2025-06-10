import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { enviroments } from 'src/environments/enviorments';
import { DataResponse } from '../model/data-response';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidateDataSubject$ = new BehaviorSubject<any>(null);
  candateData$ = this.candidateDataSubject$.asObservable();
  baseUrl = enviroments.API_URL;
  corpUrl!: string;
  constructor(private httpClient: HttpClient) {
    const value = localStorage.getItem('corp-url');
    if (value) {
      this.corpUrl = decodeURIComponent(value);
    }
  }
  getCandidatesInfo(id: string | null): Observable<DataResponse> {
    const headers = new HttpHeaders().set('corp-url', this.corpUrl);
    return this.httpClient.get<any>(
      Constants.UNPROTECTED_URL.COMMON + `/candidate/${id}`,
      {
        headers,
      }
    );
  }
  candidateLogin(email: string) {
    const headers = new HttpHeaders().set('corp-url', this.corpUrl);
    return this.httpClient.get(
      Constants.UNPROTECTED_URL.COMMON + `/candidate/exists/${email}`,
      { headers }
    );
  }
  getLoggedInCandidte(email: string) {
    const headers = new HttpHeaders().set('corp-url', this.corpUrl);
    return this.httpClient.get(
      Constants.UNPROTECTED_URL.COMMON +
        `/candidate/get-candidate-by-email/${email}`,
      { headers }
    );
  }
  setCandidateData(data: any) {
    this.candidateDataSubject$.next(data);
  }
  getCandidateData() {
    return this.candidateDataSubject$.getValue();
  }

  sendCandiateOtp(token: any) {
    return this.httpClient.post(
      Constants.UNPROTECTED_URL.COMMON + `/otp/sendotp`,
      token
    );
  }

  verifyCandidate(data: any) {
    return this.httpClient.post(
      Constants.UNPROTECTED_URL.COMMON + `/otp/validate`,
      data
    );
  }

  candidateResponse(token: string | null, data: any) {
    return this.httpClient.post(
      Constants.UNPROTECTED_URL.COMMON + `/action?token=${token}`,
      data
    );
  }
}
