import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}
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
}
