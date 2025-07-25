import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Candidate } from './candidate';
import { job } from '../../job/shared/job';
import { Constants } from 'src/app/utils/constants';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/model/data-response';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private httpClient: HttpClient) {}
  baseUrl = environment.API_URL;
  getCandidate(): Observable<DataResponse<Candidate>> {
    return this.httpClient.get<DataResponse<Candidate>>(
      Constants.CANDIDATE_URL.CANDIDATES
    );
  }
  getCandidateByJobId(jobId: string): Observable<DataResponse<Candidate[]>> {
    return this.httpClient.get<DataResponse<Candidate[]>>(
      Constants.CANDIDATE_URL.CANDIDATES + `/by-job-detail/${jobId}`
    );
  }
  deleteCandidateById(id: string): Observable<DataResponse<Candidate>> {
    return this.httpClient.delete<DataResponse<Candidate>>(
      Constants.CANDIDATE_URL.CANDIDATES + `/${id}`
    );
  }
  hireCandidateById(id: string, data: {}): Observable<DataResponse<Candidate>> {
    return this.httpClient.put<DataResponse<Candidate>>(
      Constants.CANDIDATE_URL.CANDIDATES + `/hire/${id}`,
      data
    );
  }
  rejectCandidateById(
    id: string,
    data: {}
  ): Observable<DataResponse<Candidate>> {
    return this.httpClient.put<DataResponse<Candidate>>(
      Constants.CANDIDATE_URL.CANDIDATES + `/reject/${id}`,
      data
    );
  }

  scheduleCandidateById(data: string): Observable<DataResponse<Candidate>> {
    return this.httpClient.put<any>(
      Constants.CANDIDATE_URL.CANDIDATES + '/schedule',
      data
    );
  }
  filterCandidate(data: {}): Observable<DataResponse<Candidate[]>> {
    return this.httpClient.post<DataResponse<Candidate[]>>(
      Constants.FILTER_URL.FILTER_CANDIDATE,
      data
    );
  }

  shorListCandidate(data: any): Observable<DataResponse<Candidate[]>> {
    return this.httpClient.put<DataResponse<Candidate[]>>(
      Constants.CANDIDATE_URL.SHORTLIST,
      data
    );
  }

  filterCandidateByQualifiedQuestion(
    data: any
  ): Observable<DataResponse<Candidate>> {
    return this.httpClient.put<DataResponse<Candidate>>(
      Constants.CANDIDATE_URL.FILTER_BY_QUALIFIED_QUESTION,
      data
    );
  }

  searchFilter(data: any): Observable<DataResponse<Candidate[]>> {
    return this.httpClient.post<DataResponse<Candidate[]>>(
      Constants.CANDIDATE_URL.CANDIDATES + '/search-filter',
      data
    );
  }
  sendMessage(data: any): Observable<DataResponse<any>> {
    return this.httpClient.post<any>(
      Constants.MESSAGE_URL.MESSAGE + '/user/send',
      data
    );
  }

  candidateMessage(data: any): Observable<DataResponse<any>> {
    return this.httpClient.post<any>(
      Constants.MESSAGE_URL.MESSAGE + '/candidate/send',
      data
    );
  }
  getMessage(id: string) {
    return this.httpClient.get<any>(
      Constants.MESSAGE_URL.MESSAGE + `/candidate/${id}`
    );
  }
}
