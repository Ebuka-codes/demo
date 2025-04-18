import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidateDataSubject$ = new BehaviorSubject<any>(null);
  candateData$ = this.candidateDataSubject$.asObservable();
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}

  getCandidatesInfo(id: string | null) {
    return this.httpClient.get(Constants.CANDIDATE_URL.CANDIDATES + `/${id}`);
  }
  candidateLogin(email: any) {
    return this.httpClient.get(
      Constants.CANDIDATE_URL.CANDIDATES + `/exists/${email}`
    );
  }
  getLoggedInCandidte(email: string) {
    return this.httpClient.get(
      Constants.CANDIDATE_URL.CANDIDATES + `/get-candidate-by-email/${email}`
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
      this.baseUrl + `/auth/common/otp/sendotp`,
      token
    );
  }

  verifyCandidate(data: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/common/otp/validate`,
      data
    );
  }

  candidateResponse(token: string | null, data: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/common/action?token=${token}`,
      data
    );
  }
}
