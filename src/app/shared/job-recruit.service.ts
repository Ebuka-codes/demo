import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { jobType } from './type';
import { enviroments } from 'src/environments/enviorments';

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
  error$ = this.errorSubject.asObservable();

  encodedValue = btoa('SHL');
  constructor(private httpClient: HttpClient) {}
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
}
