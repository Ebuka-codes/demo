import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DateFormatService {
  constructor() {}

  setMonthAndYear(
    formGroup: FormGroup,
    formControlName: string,
    normalizedMonthAndYear: any, // it's supposed to be a Moment, but let's be safe
    datepicker: MatDatepicker<Moment>
  ) {
    const selected = moment(normalizedMonthAndYear); // force convert

    if (!selected.isValid()) {
      console.error('Invalid monthYear selection:', normalizedMonthAndYear);
      return;
    }

    let currentVal = formGroup.get(formControlName)?.value;

    if (!moment.isMoment(currentVal)) {
      currentVal = moment(); // fallback to current date
    }

    const updated = currentVal
      .clone()
      .month(selected.month())
      .year(selected.year());

    console.log('Setting value:', updated);

    formGroup.get(formControlName)?.setValue(updated);
    datepicker.close();
  }

  // const updatedDate = ctrlValue.clone();
  // console.log('Normalized Date:', normalizedMonthAndYear);
  // const momentDate = moment(normalizedMonthAndYear);
  // console.log('Moment Object:', momentDate);
  // updatedDate.month(momentDate.month());
  // updatedDate.year(momentDate.year());
  // console.log(updatedDate, 'me here');

  // console.log(formGroup, formControlName);
  // formGroup.get(formControlName)?.setValue('03/2020');
  // formGroup.get(formControlName)?.setValue(updatedDate.toDate());
}
