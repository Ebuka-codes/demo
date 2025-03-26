import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'src/environments/enviorments';
import { Candidate } from './candidate';
import { job } from '../../job/shared/job';

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
  getCandidateByJobId(jobId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });

    return this.httpClient.get<Candidate[]>(
      this.baseUrl + `candidates/by-job-detail/${jobId}`,
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
    return this.httpClient.delete(this.baseUrl + `candidates/${id}`, {
      headers,
    });
  }
  hireCandidateById(id: string, data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(this.baseUrl + `candidates/hire/${id}`, data, {
      headers,
    });
  }
  rejectCandidateById(id: string, data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(this.baseUrl + `candidates/reject/${id}`, data, {
      headers,
    });
  }

  scheduleCandidateById(data: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(this.baseUrl + `candidates/schedule`, data, {
      headers,
    });
  }
  filterCandidate(data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post(this.baseUrl + `filter/candidate`, data, {
      headers,
    });
  }

  getAllJobs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<job>(this.baseUrl + 'job-details', { headers });
  }

  getQualifiedQuestion(id: string | undefined) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      this.baseUrl + `job-details/get-all-qualifying-question/${id}`,
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
    return this.httpClient.put(
      this.baseUrl + `candidates/shortlist-candidates`,
      data,
      {
        headers,
      }
    );
  }

  filterCandidateByQualifiedQuestion(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(
      this.baseUrl + `candidates/filter-candidates-by-qualify-questions`,
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
    return this.httpClient.get<any>(this.baseUrl + `interview-invitees`, {
      headers,
    });
  }
}
