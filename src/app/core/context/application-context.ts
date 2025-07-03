import { Injectable } from '@angular/core';
import { UserProfile, UserToken } from '../../shared/model/credential';
import { Observable, share, Subject, Subscription } from 'rxjs';
import { UtilService } from '../service/util.service';

enum EventType {
  LOGGED_IN = 1,
  USER_TOKEN,
  USER_PROFILE,
}
Injectable();
export class ApplicationContext {
  private observableMap: Map<EventType, Subject<UserToken | UserProfile>> =
    new Map();

  private userProfile$!: UserProfile;

  private userToken$!: UserToken;

  private loggedIn$!: boolean;

  constructor() {
    this.init();
  }

  private init() {
    this.callback(
      this.shareable<UserToken>(EventType.USER_TOKEN),
      (value: any) => {
        this.userToken$ = value;
      }
    );

    this.callback(
      this.shareable<UserProfile>(EventType.USER_PROFILE),
      (value: any) => {
        this.userProfile$ = value;
      }
    );
  }

  getUserToken(): UserToken {
    return this.userToken$;
  }

  getUserProfile(): UserProfile {
    return this.userProfile$;
  }

  isLoggedIn(): boolean {
    return this.loggedIn$;
  }

  get loggedIn(): Observable<boolean> | boolean {
    return this.shareable<boolean>(EventType.LOGGED_IN);
  }

  set loggedIn(loggedIn: Observable<boolean> | boolean) {
    this.subscribeValue<Observable<boolean> | boolean>(
      EventType.LOGGED_IN,
      loggedIn
    );
  }

  set userToken(userToken: Observable<UserToken> | UserToken) {
    UtilService.sendMessageToWorker(userToken);
    this.subscribeValue<Observable<UserToken> | UserToken>(
      EventType.USER_TOKEN,
      userToken
    );
  }

  get userProfile(): Observable<UserProfile> | UserProfile {
    return this.shareable<UserProfile>(EventType.USER_PROFILE);
  }

  set userProfile(userProfile: Observable<UserProfile> | UserProfile) {
    this.subscribeValue<Observable<UserProfile> | UserProfile>(
      EventType.USER_PROFILE,
      userProfile
    );
  }

  public onUserProfile(callbackFxn?: (u: UserProfile) => void): Subscription {
    const userProfile = this.getUserProfile();
    return this.onReady(
      userProfile
        ? Observable.create((o) => o.next(userProfile))
        : EventType.USER_PROFILE,
      callbackFxn
    );
  }

  public onUserToken(callbackFn?: (u: UserToken) => void): Subscription {
    const userToken = this.getUserToken();
    return this.onReady(
      userToken
        ? Observable.create((o) => o.next(userToken))
        : EventType.USER_TOKEN,
      callbackFn
    );
  }

  public onReady(
    type: EventType | Observable<any>,
    callbackFxn?: (u) => void
  ): Subscription {
    const observable: Observable<any> =
      type instanceof Observable ? type : this.shareable(type);
    return this.callback(observable, callbackFxn);
  }

  private shareable<T>(key: EventType, value?: T) {
    const subject: any = this.observable<T>(key, value, true);
    if (!subject['shareable']) {
      subject['shareable'] = subject.pipe(share());
    }
    return subject['shareable'];
  }

  private observable<T>(
    key: EventType,
    value?: T,
    notNull?: boolean
  ): Subject<T> {
    let subject = <Subject<T>>this.observableMap.get(key);
    if (!subject) {
      subject = new Subject<T>();
      this.observableMap.set(key, subject);
    }
    if (notNull ? value : true) {
      subject.next(value);
    }
    return subject;
  }

  protected callback<F>(
    subscribable: Observable<F>,
    successFn?: (value: F) => void,
    errorFn?: (error: any) => void,
    completeFn?: () => void
  ): Subscription {
    const subscription: Subscription = subscribable.subscribe(
      (value: F) => {
        if (!successFn || typeof successFn !== 'function') {
          successFn = (v) => <any>v;
        }
        successFn.call(this, value);
      },
      (error: Response) => {
        if (errorFn && typeof errorFn === 'function') {
          errorFn.call(this, error);
        }
      },
      () => {
        if (completeFn && typeof completeFn === 'function') {
          completeFn.call(this);
        }
        setTimeout(() => {
          subscription.unsubscribe();
        }, 10);
      }
    );
    return subscription;
  }

  subscribeValue<T>(subscriptionType: EventType, value: Observable<T> | T) {
    if (value instanceof Observable) {
      this.callback<T>(value, (val) => {
        this.observable<T>(subscriptionType, val);
      });
    } else {
      this.observable<T>(subscriptionType, value);
    }
  }
}
