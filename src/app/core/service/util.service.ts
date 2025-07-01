import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/model/data-response';
import { file } from 'src/app/shared/model/file';
import { Constants } from 'src/app/utils/constants';
import { CORP_URL_KEY } from '../model/credential';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  corpUrl!: string;
  baseUrl = environment.API_URL;
  constructor(private httpClient: HttpClient) {
    const value = localStorage.getItem(CORP_URL_KEY);
    if (value) {
      this.corpUrl = decodeURIComponent(value);
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
}
