import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JobApplication } from '../model/job-model';
import { Constants } from 'src/app/utils/constants';
import { DataResponse } from '../model/data-response';
import { job } from 'src/app/dashboard/job/shared/job';
import { CORP_URL_KEY } from 'src/app/core/model/credential';

@Injectable({
  providedIn: 'root',
})
export class JobRecruitService {
  baseUrl = environment.API_URL;
  private jobListSubject$ = new BehaviorSubject<job[] | null>(null);
  private jobCategorySubject$ = new BehaviorSubject<any | null>(null);
  private category$ = this.jobCategorySubject$.asObservable();
  job$ = this.jobListSubject$.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private jobDetailsId: string | null = null;
  isLoading: boolean = false;
  private jobDetailDataSubject = new BehaviorSubject<any>(null);
  jobDetailData$ = this.jobDetailDataSubject.asObservable();

  corpUrl!: string;
  constructor(private httpClient: HttpClient) {
    const value = localStorage.getItem(CORP_URL_KEY);
    if (value) {
      this.corpUrl = decodeURIComponent(value);
    }
  }

  getJobList(): Observable<DataResponse<job[]>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.get<any>(
      Constants.UNPROTECTED_URL.COMMON + '/job/get-all',
      { headers }
    );
  }
  getJobDetailsById(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.get(
      Constants.UNPROTECTED_URL.COMMON + `/job/${id}`,
      { headers }
    );
  }
  searchJobs(params: string): Observable<DataResponse<job[]>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.get<DataResponse<job[]>>(
      Constants.UNPROTECTED_URL.COMMON + `/job/search?keyword=${params}`,
      { headers }
    );
  }
  filterJobs(params: string[]): Observable<DataResponse<job[]>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.get<DataResponse<job[]>>(
      Constants.UNPROTECTED_URL.COMMON +
        `/job/search-job-type?types=${params.join(',')}`,
      { headers }
    );
  }
  getJobType() {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    this.httpClient
      .get<any>(Constants.UNPROTECTED_URL.COMMON + '/job/jobtype', { headers })
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
  submitJobApplication(
    application: JobApplication
  ): Observable<DataResponse<JobApplication>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.post<DataResponse<JobApplication>>(
      Constants.UNPROTECTED_URL.COMMON + '/candidate/create',
      application,
      { headers }
    );
  }

  convertFileToBase64(file: any) {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl || '',
    });
    return this.httpClient.post<any>(
      Constants.UNPROTECTED_URL.COMMON + '/upload-base64',
      file,
      { headers }
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
