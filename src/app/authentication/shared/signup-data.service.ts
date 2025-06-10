import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignupDataService {
  userDataSubject$ = new BehaviorSubject<any>(null);
  data$ = this.userDataSubject$.asObservable();
  constructor() {}
  setRegisterDta(data: any) {
    this.userDataSubject$.next(data);
  }
  getRegisterData(): Observable<any> {
    return this.data$;
  }
}
