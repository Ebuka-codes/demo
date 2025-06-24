import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Interviewer } from './interviewer';
import { Constants } from 'src/app/utils/constants';
import { DataResponse } from 'src/app/shared/model/data-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  baseUrl = environment.API_URL;
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

  feedback(data: any): Observable<DataResponse<Interviewer>> {
    return this.httpClient.post<any>(
      Constants.FEEDBACK_URL.FEEDBACK + `/send-feedback-link`,
      data
    );
  }

  getInterviewer(): Observable<DataResponse<Interviewer[]>> {
    return this.httpClient.get<DataResponse<Interviewer[]>>(
      Constants.INTERVIEW_URL.INTERVIEWER
    );
  }
}
