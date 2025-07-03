import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataResponse } from 'src/app/shared/model/data-response';
import { file } from 'src/app/shared/model/file';
import { Constants } from 'src/app/utils/constants';
import { CORP_URL_KEY } from '../../shared/model/credential';
import { environment } from 'src/environments/environment';

export class AuthError {
  error!: boolean;
  errorCode!: string;
}
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  corpUrl!: string;

  baseUrl = environment.API_URL;

  public tokenExpireSubject: Subject<AuthError> = new Subject();

  constructor(private httpClient: HttpClient) {
    const value = localStorage.getItem(CORP_URL_KEY);
    if (value) {
      this.corpUrl = value;
    }
  }

  getTokenExpireSession() {
    return this.tokenExpireSubject.asObservable();
  }

  public static sendMessageToWorker(message: any) {
    if (navigator.serviceWorker) {
      if (navigator.serviceWorker.controller) {
        if (message == null) message = 'null';

        if (typeof message !== 'string') {
          message = JSON.stringify(message);
        }
        navigator.serviceWorker.controller.postMessage('iroko-sw' + message);
      }
    }
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  isValidNumberInput(
    event: { keyCode: any; charCode: any },
    acceptDecimal?: boolean
  ) {
    const otherValidKeys = [8, 9, 37, 39];
    if (acceptDecimal) {
      otherValidKeys.push(46);
    }
    const keyCode = event.keyCode || event.charCode;
    if (
      (keyCode > 47 && keyCode < 58) ||
      otherValidKeys.find((obj) => obj == keyCode)
    ) {
      return true;
    } else {
      return false;
    }
  }

  formatDate(data: any) {
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    const dataFormate = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    return dataFormate;
  }

  convertFileTobase64(file: file): Observable<DataResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<any>(
      this.baseUrl + '/api/document/upload-base64',
      file,
      {
        headers,
      }
    );
  }

  unprotectedFileBase64(file: any) {
    const headers = new HttpHeaders({
      'corp-url': this.corpUrl,
    });
    return this.httpClient.post<any>(
      Constants.UNPROTECTED_URL.COMMON + '/upload-base64',
      file,
      { headers }
    );
  }

  generateEndcodeUrl(): Observable<DataResponse<any>> {
    return this.httpClient.get<any>(
      Constants.CORPORATE_URL.CORPORATE + '/encode-url'
    );
  }
  generateOtp(data: any) {
    return this.httpClient.post(Constants.AUTH_URL.VERIFICATION_OTP, data);
  }
}
