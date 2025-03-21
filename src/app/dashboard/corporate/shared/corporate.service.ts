import { Injectable } from '@angular/core';
import { Corporate, file } from './corporate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroments } from 'src/environments/enviorments';

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
      this.baseUrl + `corporates`,
      corporate,
      {
        headers,
      }
    );
  }
  getCorporate() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.get<any>(this.baseUrl + `corporates`, {
      headers,
    });
  }
  editCorporate(id: string, data: Corporate) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'corp-key': 'true',
    });
    return this.httpClient.put<Corporate>(
      this.baseUrl + `corporates/${id}`,
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
    return this.httpClient.delete(this.baseUrl + `corporates/${id}`, {
      headers,
    });
  }

  convertFileToBase64(file: file) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post<file>(
      this.baseUrl + 'document/upload-base64',
      file,
      {
        headers,
      }
    );
  }
}
