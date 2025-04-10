import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { enviroments } from 'src/environments/enviorments';
import { NavigationEnd, Router } from '@angular/router';
import { DetailsType, job, JobApplication } from '../type';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class JobRecruitService {
  baseUrl = enviroments.API_URL;
  private jobListSubject$ = new BehaviorSubject<job[] | null>(null);
  private jobCategorySubject$ = new BehaviorSubject<any | null>(null);
  private category$ = this.jobCategorySubject$.asObservable();
  job$ = this.jobListSubject$.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  private lastpathSubject$ = new BehaviorSubject<string>('');
  lastPath$ = this.lastpathSubject$.asObservable();
  error$ = this.errorSubject.asObservable();
  private jobDetailsId: string | null = null;
  encodedValue: any;
  isLoading: boolean = false;
  private jobDetailDataSubject = new BehaviorSubject<any>(null);
  jobDetailData$ = this.jobDetailDataSubject.asObservable();

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

  getJobList(): Observable<any> {
    if (!this.jobListSubject$.value) {
      this.isLoadingSubject.next(true);
      this.httpClient
        .get<any>(Constants.JOB_URL.JOB)
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
    return this.httpClient.get(Constants.JOB_URL.JOB + `/${id}`, {
      headers,
    });
  }
  searchJobs(params: string): Observable<any> {
    return this.httpClient.get<any>(
      Constants.JOB_URL.JOB + `/search?keyword=${params}`
    );
  }
  filterJobs(params: string[]): Observable<any> {
    return this.httpClient.get<any>(
      Constants.JOB_URL.JOB + `/search-job-type?types=${params.join(',')}`
    );
  }

  getJobType() {
    this.httpClient
      .get<any>(Constants.JOB_URL.JOB + '/jobtype')
      .pipe(
        tap((response) => {
          if (response.valid && response.data) {
            this.jobCategorySubject$.next(response.data);
          }
        })
      )
      .subscribe();
    return this.category$;
  }

  getJobDetails(id: string | null) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<JobApplication>(
      Constants.JOB_URL.JOB + `/${id}`,
      {
        headers,
      }
    );
  }
  submitJobApplication(application: JobApplication) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<JobApplication>(
      Constants.CANDIDATE_URL.CANDIDATES,
      application,
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
    return this.httpClient.get<DetailsType>(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS,
      {
        headers,
      }
    );
  }

  createQueryDetails(data: DetailsType) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<DetailsType>(
      Constants.QUERY_DETAILS_URL.QUERY_DETAILS,
      data,
      {
        headers,
      }
    );
  }
  searchJobByTitle(title: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<JobApplication>(
      this.baseUrl + `/api/job-lists/${title}`,
      {
        headers,
      }
    );
  }
  convertFileToBase64(file: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<any>(
      this.baseUrl + '/api/document/upload-base64',
      file,
      {
        headers,
      }
    );
  }
  setJobDetailId(id: string) {
    this.jobDetailsId = id;
  }
  getJobDetailId(): string | null {
    return this.jobDetailsId;
  }

  setLoading(value: boolean) {
    this.isLoadingSubject.next(value);
  }
  getLoading() {
    return this.isLoading$;
  }

  setJobDetailData(data: any) {
    this.jobDetailDataSubject.next(data);
  }
}
