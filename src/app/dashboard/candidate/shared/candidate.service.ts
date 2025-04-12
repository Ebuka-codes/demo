import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';
import { Candidate } from './candidate';
import { job } from '../../job/shared/job';
import { Constants } from 'src/app/utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = enviroments.API_URL;
  getCandidate(): Observable<Candidate[]> {
    return this.httpClient.get<Candidate[]>(Constants.CANDIDATE_URL.CANDIDATES);
  }
  getCandidateByJobId(jobId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<Candidate>(
      Constants.CANDIDATE_URL.CANDIDATES + `by-job-detail/${jobId}`,
      {
        headers,
      }
    );
  }
  deleteCandidateById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(
      Constants.CANDIDATE_URL.CANDIDATES + `/${id}`,
      {
        headers,
      }
    );
  }
  hireCandidateById(id: string, data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(
      Constants.CANDIDATE_URL.CANDIDATES + `/hire/${id}`,
      data,
      {
        headers,
      }
    );
  }
  rejectCandidateById(id: string, data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(
      Constants.CANDIDATE_URL.CANDIDATES + `/reject/${id}`,
      data,
      {
        headers,
      }
    );
  }

  scheduleCandidateById(data: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(Constants.CANDIDATE_URL + '/schedule', data, {
      headers,
    });
  }
  filterCandidate(data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(Constants.FILTER_URL.FILTER_CANDIDATE, data, {
      headers,
    });
  }
  getAllJobs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<job>(Constants.JOB_URL.JOB, {
      headers,
    });
  }
  getQualifiedQuestion(id: string | undefined) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      Constants.JOB_URL.JOB + `/get-all-qualifying-question/${id}`,
      {
        headers,
      }
    );
  }
  shorListCandidate(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(Constants.CANDIDATE_URL.SHORTLIST, data, {
      headers,
    });
  }

  filterCandidateByQualifiedQuestion(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(
      Constants.CANDIDATE_URL.FILTER_BY_QUALIFIED_QUESTION,
      data,
      {
        headers,
      }
    );
  }

  getInterviewer() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(Constants.INTERVIEW_URL.GET_INTERVIEWERS, {
      headers,
    });
  }

  getCandidateOperand() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(Constants.CANDIDATE_URL.SEARCH_OPERAND, {
      headers,
    });
  }
}
