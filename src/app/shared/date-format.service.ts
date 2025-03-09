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
    let ctrlValue = formGroup.get(formControlName)?.value ?? moment();
    if (!ctrlValue) {
      ctrlValue = moment();
    } else {
      ctrlValue = moment(ctrlValue);
    }
    const updatedDate = ctrlValue.clone();
    const momentDate = moment(normalizedMonthAndYear);
    updatedDate.month(momentDate.month());
    updatedDate.year(momentDate.year());
    formGroup.get(formControlName)?.setValue(updatedDate);

    console.log(`Start Date: ${formGroup.get('startDate')?.value}`);
    console.log(`End Date: ${formGroup.get('endDate')?.value}`);

    datepicker.close();
  }
}
