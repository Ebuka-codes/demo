import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { DetailsType, job, JobApplication } from './type';
import { enviroments } from 'src/environments/enviorments';
import { NavigationEnd, Router } from '@angular/router';

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
  private candiateEmail: string | null = null;
  encodedValue: any;
  isLoading: boolean = false;

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

  searchJobs(params: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<any>(
      this.baseUrl + `job-details/search?keyword=${params}`,
      {
        headers,
      }
    );
  }

  filterJobs(params: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<any>(
      this.baseUrl + `job-details/search-job-type?types=${params.join(',')}`,
      {
        headers,
      }
    );
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
  getJobType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    this.httpClient
      .get<any>(this.baseUrl + 'job-details/jobtype', {
        headers,
      })
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
  submitJobApplication(application: JobApplication) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.post<JobApplication>(
      this.baseUrl + `candidates`,
      application,
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
    return this.httpClient.get<any>(this.baseUrl + `candidates`, {
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

  // createCorporate(corporate: Corporate) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.httpClient.post<Corporate>(
  //     this.baseUrl + `corporates`,
  //     corporate,
  //     {
  //       headers,
  //     }
  //   );
  // }

  getQueryDetailsByType() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': this.encodedValue,
    });
    return this.httpClient.get<DetailsType>(this.baseUrl + `query-details`, {
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
    return this.httpClient.post<any>(
      'http://localhost:8088/document/upload-base64',
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
  setCandidateEmail(email: string) {
    this.candiateEmail = email;
  }
  getCandidateEmail(): string | null {
    return this.candiateEmail;
  }

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoading$;
  }
}
