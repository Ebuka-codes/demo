import { Injectable } from '@angular/core';
import { job, Question } from './job';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { DataResponse } from 'src/app/shared/model/data-response';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  baseUrl = environment.API_URL;
  lastpathSubject$ = new BehaviorSubject<string | null>('');
  lastPath = this.lastpathSubject$.asObservable();
  encodedValue!: string;
  constructor(private httpClient: HttpClient) {}

  createJob(newJob: job) {
    return this.httpClient.post<job>(Constants.JOB_URL.JOB, newJob);
  }

  editJob(id: string | null, newJob: job) {
    return this.httpClient.put<job>(Constants.JOB_URL.JOB + `/${id}`, newJob);
  }

  deleteJob(id: string) {
    return this.httpClient.delete(Constants.JOB_URL.JOB + `/${id}`);
  }
  getJobById(id: string | null): Observable<DataResponse<job>> {
    return this.httpClient.get<DataResponse<job>>(
      Constants.JOB_URL.JOB + `/${id}`
    );
  }
  getAllJobs(): Observable<DataResponse<job>> {
    return this.httpClient.get<DataResponse<job>>(Constants.JOB_URL.JOB);
  }

  getActiveJobs(): Observable<DataResponse<job>> {
    return this.httpClient.get<DataResponse<job>>(
      Constants.JOB_URL.JOB + '/get-all-active-job'
    );
  }

  getPublishJobs(): Observable<DataResponse<job>> {
    return this.httpClient.get<DataResponse<job>>(
      Constants.JOB_URL.JOB + '/get-published-jobs'
    );
  }

  publishJobs(data: any): Observable<DataResponse<job>> {
    return this.httpClient.post<DataResponse<job>>(
      Constants.JOB_URL.JOB + '/publish-job-mass',
      data
    );
  }
  editQueryDetails(id: string, value: any) {
    return this.httpClient.put(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS + `/${id}`,
      value
    );
  }
  deleteQueryDetails(id: string) {
    return this.httpClient.delete(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS + `/${id}`
    );
  }
  createQuestion(question: any): Observable<DataResponse<Question>> {
    return this.httpClient.post<DataResponse<Question>>(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS,
      question
    );
  }

  getQuestionById(id: string) {
    return this.httpClient.get(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`
    );
  }
  getAllQuestions() {
    return this.httpClient.get(Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS);
  }
  editQuestion(id: string, data: any): Observable<DataResponse<Question>> {
    return this.httpClient.put<DataResponse<Question>>(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`,
      data
    );
  }
  getOperator() {
    return this.httpClient.get(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/get-all-operator`
    );
  }

  getQueryDetailsByType() {
    return this.httpClient.get(Constants.QUERY_DETAILS_URL.QUERY_DETAILS);
  }
  deleteQuestionsById(id: string) {
    return this.httpClient.delete(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`
    );
  }

  createQueryDetails(data: any) {
    return this.httpClient.post<any>(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS,
      data
    );
  }
  searchjob(data: string): Observable<DataResponse<job[]>> {
    return this.httpClient.get<DataResponse<job[]>>(
      Constants.JOB_URL.JOB + `/search?keyword=${data}`
    );
  }
  getJobType() {
    return this.httpClient.get(Constants.JOB_URL.JOB + '/jobtype');
  }

  filterJob(data: {}) {
    return this.httpClient.post(Constants.FILTER_URL.FILTER_JOB, data);
  }
}
