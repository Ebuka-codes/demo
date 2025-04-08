import { Injectable } from '@angular/core';
import { Corporate, file } from './corporate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroments } from 'src/environments/enviorments';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CorporateService {
  baseUrl = enviroments.API_URL;
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
  getCorporate() {
    return this.httpClient.get<any>(Constants.CORPORATE_URL.CORPORATE);
  }
  editCorporate(id: string, data: Corporate) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put<Corporate>(
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

  convertFileToBase64(file: file) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<file>(
      this.baseUrl + '/api/document/upload-base64',
      file,
      {
        headers,
      }
    );
  }
}
