import { Injectable } from '@angular/core';
import { Corporate, file } from './corporate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/utils/constants';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/model/data-response';

@Injectable({
  providedIn: 'root',
})
export class CorporateService {
  baseUrl = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

  createCorporate(corporate: Corporate) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.post<Corporate>(
      Constants.CORPORATE_URL.CORPORATE,
      corporate,
      {
        headers,
      }
    );
  }
  getAllCorporate() {
    return this.httpClient.get<any>(Constants.CORPORATE_URL.CORPORATE);
  }
  getUserCorporate(): Observable<DataResponse> {
    return this.httpClient.get<any>(
      Constants.CORPORATE_URL.CORPORATE + '/get-user-corporate'
    );
  }
  editCorporate(id: string, data: Corporate): Observable<DataResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put<any>(
      Constants.CORPORATE_URL.CORPORATE + `/${id}`,
      data,
      {
        headers,
      }
    );
  }

  deleteCorporate(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.delete(
      Constants.CORPORATE_URL.CORPORATE + `/${id}`,
      {
        headers,
      }
    );
  }

  convertFileToBase64(file: file): Observable<DataResponse> {
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
  generateEndcodeUrl(): Observable<DataResponse> {
    return this.httpClient.get<any>(
      Constants.CORPORATE_URL.CORPORATE + '/encode-url'
    );
  }
}
