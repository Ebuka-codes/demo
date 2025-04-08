import { Injectable } from '@angular/core';
import { job } from './job';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroments } from 'src/environments/enviorments';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  baseUrl = enviroments.API_URL;
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
  getJobById(id: string | null) {
    return this.httpClient.get<job>(Constants.JOB_URL.JOB + `/${id}`);
  }
  getAllJobs() {
    return this.httpClient.get<job>(Constants.JOB_URL.JOB);
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
  createQuestion(question: any) {
    return this.httpClient.post(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS,
      question
    );
  }
  getAllQuestions() {
    return this.httpClient.get(Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS);
  }

  getOperator() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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
  getQuestionsById(id: string) {
    return this.httpClient.get(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`
    );
  }

  searchjob(data: string) {
    return this.httpClient.get(
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
