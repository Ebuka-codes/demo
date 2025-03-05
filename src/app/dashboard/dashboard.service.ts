import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { enviroments } from 'src/environments/enviorments';
import {
  CandidateInfo,
  Corporate,
  DetailsType,
  file,
  JobApplication,
  jobType,
} from '../shared/type';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = enviroments.API_URL;
  private lastpathSubject$ = new BehaviorSubject<string>('');
  lastPath$ = this.lastpathSubject$.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  encodedValue: any;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.updateLastPath();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLastPath();
      }
    });
  }
  ngOnInit(): void {}

  updateLastPath() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);
    const lastPath = urlSegments.length
      ? `/${urlSegments[urlSegments.length - 1]}`
      : '';
    this.lastpathSubject$.next(lastPath);
    this.encodedValue = btoa(lastPath?.replace(/^\/+|\/+$/g, '').toUpperCase());
  }
  getAllQuestions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get(this.baseUrl + `question-options`, {
      headers,
    });
  }

  createQuestion(question: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post(this.baseUrl + `question-options`, question, {
      headers,
    });
  }
  getCandidateInfo(email: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<any>(
      this.baseUrl + `candidates/exist/${email}`,
      {
        headers,
      }
    );
  }
  getCandidate() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    console.log(this.encodedValue);
    return this.httpClient.get<CandidateInfo>(this.baseUrl + `candidates`, {
      headers,
    });
  }

  deleteCandidateById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.delete<any>(this.baseUrl + `candidates/${id}`, {
      headers,
    });
  }
  createCorporate(corporate: Corporate) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<Corporate>(
      this.baseUrl + `corporates`,
      corporate,
      {
        headers,
      }
    );
  }

  getCorporate() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get<any>(this.baseUrl + `corporates`, {
      headers,
    });
  }

  createJob(newJob: jobType): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<jobType>(this.baseUrl + 'job-details', newJob, {
      headers,
    });
  }

  createQueryDetails(data: DetailsType) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<DetailsType>(
      this.baseUrl + `query-details`,
      data,
      {
        headers,
      }
    );
  }
  getQueryDetailsByType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<DetailsType>(this.baseUrl + `query-details`, {
      headers,
    });
  }
  searchJobByTitle(title: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<JobApplication>(
      this.baseUrl + `job-lists/${title}`,
      {
        headers,
      }
    );
  }
  convertFileToBase64(file: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<file>(
      'http://localhost:8088/document/upload-base64',
      file,
      {
        headers,
      }
    );
  }

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoading$;
  }
}
