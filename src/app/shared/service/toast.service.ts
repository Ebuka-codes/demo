import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  notfy = new Notyf();
  constructor() {}

  success(message: string) {
    return this.notfy.success({
      message: message,
      duration: 2000,
      position: { x: 'right', y: 'top' },
    });
  }

  error(message: string) {
    return this.notfy.error({
      message: message,
      duration: 2000,
      position: { x: 'right', y: 'top' },
    });
  }
}
