import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  constructor() {}

  setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
  getLoading() {
    return this.isLoading$;
  }
}
