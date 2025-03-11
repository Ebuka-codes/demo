import { Injectable } from '@angular/core';
import { job } from './job';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroments } from 'src/environments/enviorments';
import { BehaviorSubject } from 'rxjs';

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
    return this.httpClient.post<job>(this.baseUrl + 'job-details', newJob, {
      headers,
    });
  }
  getJobById(id: string | null) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<job>(this.baseUrl + `job-details/${id}`, {
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

  editQueryDetails(id: string, value: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put(this.baseUrl + `query-details/${id}`, value, {
      headers,
    });
  }
  deleteQueryDetails(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(
      this.baseUrl + `query-details/${id}`,

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
    return this.httpClient.post(this.baseUrl + `question-options`, question, {
      headers,
    });
  }
  getAllQuestions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(this.baseUrl + `question-options`, {
      headers,
    });
  }
  getQueryDetailsByType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(this.baseUrl + `query-details`, {
      headers,
    });
  }
  deleteQuestionsById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(this.baseUrl + `question-options/${id}`, {
      headers,
    });
  }

  createQueryDetails(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<any>(this.baseUrl + `query-details`, data, {
      headers,
    });
  }
  getQuestionsById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get(this.baseUrl + `question-options/${id}`, {
      headers,
    });
  }

  filterjob(data: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<job[]>(
      this.baseUrl + `job-details/search?keyword=${data}`,
      {
        headers,
      }
    );
  }
}
