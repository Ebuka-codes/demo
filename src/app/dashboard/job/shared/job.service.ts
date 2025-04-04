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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<job>(Constants.JOB_URL.JOB, newJob, {
      headers,
    });
  }

  editJob(id: string | null, newJob: job) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put<job>(Constants.JOB_URL.JOB + `/${id}`, newJob, {
      headers,
    });
  }

  deleteJob(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(Constants.JOB_URL.JOB + `/${id}`, {
      headers,
    });
  }
  getJobById(id: string | null) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<job>(Constants.JOB_URL.JOB + `/${id}`, {
      headers,
    });
  }
  getAllJobs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<job>(Constants.JOB_URL.JOB, { headers });
  }

  editQueryDetails(id: string, value: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS + `/${id}`,
      value,
      {
        headers,
      }
    );
  }
  deleteQueryDetails(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS + `/${id}`,
      {
        headers,
      }
    );
  }
  createQuestion(question: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS,
      question,
      {
        headers,
      }
    );
  }
  getAllQuestions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS, {
      headers,
    });
  }

  getOperator() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/get-all-operator`,
      {
        headers,
      }
    );
  }

  getQueryDetailsByType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(Constants.QUERY_DETAILS_URL.QUERY_DETAILS, {
      headers,
    });
  }
  deleteQuestionsById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`,
      {
        headers,
      }
    );
  }

  createQueryDetails(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<any>(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS,
      data,
      {
        headers,
      }
    );
  }
  getQuestionsById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      Constants.QUESTION_OPTION_URL.QUESTION_OPTIONS + `/${id}`,
      {
        headers,
      }
    );
  }

  searchjob(data: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(
      Constants.JOB_URL.JOB + `/search?keyword=${data}`,
      {
        headers,
      }
    );
  }
  getJobType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(Constants.JOB_URL.JOB + '/jobtype', {
      headers,
    });
  }

  filterJob(data: {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post(Constants.FILTER_URL.FILTER_JOB, data, {
      headers,
    });
  }
}
