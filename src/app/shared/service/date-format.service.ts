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
    normalizedMonthAndYear: any,
    datepicker: MatDatepicker<Moment>
  ) {
    const selected = moment(normalizedMonthAndYear);

    if (!selected.isValid()) {
      console.error('Invalid monthYear selection:', normalizedMonthAndYear);
      return;
    }

    let currentVal = formGroup.get(formControlName)?.value;

    if (!moment.isMoment(currentVal)) {
      currentVal = moment();
    }

    const updated = currentVal
      .clone()
      .month(selected.month())
      .year(selected.year());

    console.log('Setting value:', updated);

    formGroup.get(formControlName)?.setValue(updated);
    datepicker.close();
  }
}
