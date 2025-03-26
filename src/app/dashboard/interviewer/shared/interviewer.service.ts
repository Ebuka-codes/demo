import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';
import { Interviewer } from './interviewer';

@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}

  createInterviewer(data: Interviewer) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<Interviewer>(
      this.baseUrl + 'interview-invitees',
      data,
      { headers }
    );
  }
}
