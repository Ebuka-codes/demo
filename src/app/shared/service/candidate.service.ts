import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidateDataSubject$ = new BehaviorSubject<any>(null);
  candateData$ = this.candidateDataSubject$.asObservable();
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
}
