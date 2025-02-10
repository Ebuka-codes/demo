import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jobType } from './type';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class JobRecruitService {
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}
  createJob(newJob: jobType): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<jobType>(this.baseUrl + 'job-details', newJob, {
      headers,
    });
  }

  private selectedJobSource = new BehaviorSubject<any>(null);
  selectedJob$ = this.selectedJobSource.asObservable();
  setSelectedJob(job: any) {
    this.selectedJobSource.next(job);
  }
}
