import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { jobType } from './type';
import { enviroments } from 'src/environments/enviorments';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class JobRecruitService {
  baseUrl = enviroments.API_URL;
  private jobListSubject$ = new BehaviorSubject<jobType[] | null>(null);
  job$ = this.jobListSubject$.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  private lastpathSubject$ = new BehaviorSubject<string>('');
  lastPath$ = this.lastpathSubject$.asObservable();
  error$ = this.errorSubject.asObservable();
  private jobDetailsId: string | null = null;
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
    console.log(this.encodedValue);
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
  getJobList(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });

    if (!this.jobListSubject$.value) {
      this.isLoadingSubject.next(true);
      this.httpClient
        .get<any>(this.baseUrl + 'job-details', {
          headers,
        })
        .pipe(
          tap((response) => {
            if (response.valid && response.data) {
              this.jobListSubject$.next(response.data);
              this.isLoadingSubject.next(false);
            }
          }),

          finalize(() => this.isLoadingSubject.next(false))
        )
        .subscribe();
    }
    return this.job$;
  }
  getJobDetailsById(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get(this.baseUrl + `job-details/${id}`, {
      headers,
    });
  }
  getQuestionOption() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get(this.baseUrl + `question-options`, {
      headers,
    });
  }

  setJobDetailId(id: string) {
    this.jobDetailsId = id;
  }
  getJobDetailId(): string | null {
    return this.jobDetailsId;
  }
}
