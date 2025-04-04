import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  userSubject$ = new BehaviorSubject<any>(null);
  user$ = this.userSubject$.asObservable();

  constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {}

  loadUserProfile() {
    return this.httpClient.get(Constants.USER_URL.PROFILE);
  }
  setUserProfile(user: any) {
    this.userSubject$.next(user);
  }
  getUserProfile() {
    return this.user$;
  }

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoadingSubject.getValue();
  }
}
