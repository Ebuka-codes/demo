import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResponse } from '../shared/model/data-response';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  userSubject$ = new BehaviorSubject<any>(null);
  user$ = this.userSubject$.asObservable();
  baseUrl = environment.API_URL;
  constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {}

  getDashboardData() {
    return this.httpClient.get<any>(this.baseUrl + '/api/dashboard');
  }

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoadingSubject.getValue();
  }
}
