import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}
  sendInterviewrOtp(token: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/common/interviewer/send-otp`,
      token
    );
  }
  verifyInterviewer(data: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/common/interviewer/validate`,
      data
    );
  }
  interviewerFeedback(token: string | null, data: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/common/action?token=${token}`,
      data
    );
  }
  interviewedCandidate(token: string) {
    return this.httpClient.get(
      this.baseUrl + `/auth/common/interviewer/candidate-detail/${token}`
    );
  }

  sendFeeback(token: string | null, data: any) {
    return this.httpClient.post(
      this.baseUrl + `/auth/feedback-submit/submit?token=${token}`,
      data
    );
  }
}
