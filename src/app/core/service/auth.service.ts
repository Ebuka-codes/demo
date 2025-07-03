import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/utils/constants';
import { CorporateDto } from '../model/auth';
import { UserProfile, UserToken } from '../../shared/model/credential';
import { ApplicationContext } from '../context/application-context';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profileSubject$ = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject$.asObservable();
  loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();
  constructor(
    private httpClient: HttpClient,
    private applicationContext: ApplicationContext
  ) {}
}
