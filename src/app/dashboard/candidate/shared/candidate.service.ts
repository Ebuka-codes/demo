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
    return this.httpClient.get<Candidate>(
      Constants.CANDIDATE_URL.CANDIDATES + `/by-job-detail/${jobId}`
    );
  }
  deleteCandidateById(id: string) {
    return this.httpClient.delete(
      Constants.CANDIDATE_URL.CANDIDATES + `/${id}`
    );
  }
  hireCandidateById(id: string, data: {}) {
    return this.httpClient.put(
      Constants.CANDIDATE_URL.CANDIDATES + `/hire/${id}`,
      data
    );
  }
  rejectCandidateById(id: string, data: {}) {
    return this.httpClient.put(
      Constants.CANDIDATE_URL.CANDIDATES + `/reject/${id}`,
      data
    );
  }

  scheduleCandidateById(data: string) {
    return this.httpClient.put(Constants.CANDIDATE_URL + '/schedule', data);
  }
  filterCandidate(data: {}) {
    return this.httpClient.put(Constants.FILTER_URL.FILTER_CANDIDATE, data);
  }
  getAllJobs() {
    return this.httpClient.get<job>(Constants.JOB_URL.JOB);
  }
  getQualifiedQuestion(id: string | undefined) {
    return this.httpClient.get(
      Constants.JOB_URL.JOB + `/get-all-qualifying-question/${id}`
    );
  }
  shorListCandidate(data: any) {
    return this.httpClient.put(Constants.CANDIDATE_URL.SHORTLIST, data);
  }

  filterCandidateByQualifiedQuestion(data: any) {
    return this.httpClient.put(
      Constants.CANDIDATE_URL.FILTER_BY_QUALIFIED_QUESTION,
      data
    );
  }

  getInterviewer() {
    return this.httpClient.get(Constants.INTERVIEW_URL.INTERVIEWER);
  }

  getCandidateOperand() {
    return this.httpClient.get(Constants.CANDIDATE_URL.SEARCH_OPERAND);
  }
  searchFilter(data: any) {
    return this.httpClient.post(
      Constants.CANDIDATE_URL.CANDIDATES + '/search-filter',
      data
    );
  }
  sendMessage(data: any) {
    return this.httpClient.post(
      Constants.MESSAGE_URL.MESSAGE + '/candidate/send',
      data
    );
  }
  getMessage(id: string) {
    return this.httpClient.get(
      Constants.MESSAGE_URL.MESSAGE + `/candidate/${id}`
    );
  }
}
