import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';
import { Interviewer } from './interviewer';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}

  createInterviewer(data: Interviewer) {
    return this.httpClient.post<Interviewer>(
      Constants.INTERVIEW_URL.INTERVIEWER,
      data
    );
  }

  getAllInterviewers() {
    return this.httpClient.get<Interviewer>(
      Constants.INTERVIEW_URL.INTERVIEWER
    );
  }
}
