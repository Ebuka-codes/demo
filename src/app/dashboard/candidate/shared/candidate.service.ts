import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';
import { Candidate } from './candidate';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = enviroments.API_URL;
  getCandidate() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });

    return this.httpClient.get<Candidate>(this.baseUrl + `candidates`, {
      headers,
    });
  }

  deleteCandidateById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete<any>(this.baseUrl + `candidates/${id}`, {
      headers,
    });
  }
}
