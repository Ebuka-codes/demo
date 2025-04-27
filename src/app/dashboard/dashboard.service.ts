import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { enviroments } from 'src/environments/enviorments';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  userSubject$ = new BehaviorSubject<any>(null);
  user$ = this.userSubject$.asObservable();
  baseUrl = enviroments.API_URL;
  constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {}

  getDashboardData() {
    return this.httpClient.get(this.baseUrl + '/api/dashboard');
  }

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoadingSubject.getValue();
  }
}
