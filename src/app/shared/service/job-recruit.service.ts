import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JobApplication } from '../model/job-model';
import { Constants } from 'src/app/utils/constants';
import { DataResponse } from '../model/data-response';
import { job } from 'src/app/dashboard/job/shared/job';
import { CORP_URL_KEY } from 'src/app/shared/model/credential';
import { PaginationConfig } from '../model/pagination-model';
import { FilterOption, PostedDateOption } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class JobRecruitService {
  baseUrl = environment.API_URL;
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
      this.corpUrl = value;
    }
  }

  getJobList(
    page: number,
    size: number
  ): Observable<DataResponse<PaginationConfig<job>>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.get<DataResponse<PaginationConfig<job>>>(
      Constants.UNPROTECTED_URL.COMMON + '/job/get-all',
      { headers, params: { page, size } }
    );
  }
  getJobDetailsById(id: any): Observable<DataResponse<job>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.get<DataResponse<job>>(
      Constants.UNPROTECTED_URL.COMMON + `/job/${id}`,
      { headers }
    );
  }
  searchJobs(
    params: string,
    page: number,
    size: number
  ): Observable<DataResponse<PaginationConfig<job>>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.get<DataResponse<PaginationConfig<job>>>(
      Constants.UNPROTECTED_URL.COMMON + `/job/search?keyword=${params}`,
      { headers, params: { page, size } }
    );
  }
  filterJobs(
    data: FilterOption,
    page: number,
    size: number
  ): Observable<DataResponse<PaginationConfig<job>>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.post<DataResponse<PaginationConfig<job>>>(
      Constants.UNPROTECTED_URL.COMMON + '/jobs/filter',
      data,
      { headers, params: { page, size } }
    );
  }
  getPostedDate() {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.get<PostedDateOption[]>(
      Constants.UNPROTECTED_URL.COMMON + '/posted-date-filters',
      {
        headers,
      }
    );
  }
  getQuery() {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.get<any[]>(
      Constants.UNPROTECTED_URL.COMMON + '/query/all',
      {
        headers,
      }
    );
  }
  submitJobApplication(
    application: JobApplication
  ): Observable<DataResponse<JobApplication>> {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.post<DataResponse<JobApplication>>(
      Constants.UNPROTECTED_URL.COMMON + '/candidate/create',
      application,
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
