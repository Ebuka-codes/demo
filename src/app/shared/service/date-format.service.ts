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

    // If the control value is a moment object, we keep it; otherwise, we default to a new moment object
    if (!(ctrlValue instanceof moment)) {
      ctrlValue = moment(ctrlValue);
    }

    const updatedDate = ctrlValue.clone();
    console.log('Normalized Date:', normalizedMonthAndYear);
    const momentDate = moment(normalizedMonthAndYear);
    console.log('Moment Object:', momentDate);

    updatedDate.month(momentDate.month());
    updatedDate.year(momentDate.year());

    console.log(updatedDate); // Log to verify correct date

    // If you want to keep it as a moment object:
    formGroup.get(formControlName)?.setValue(updatedDate); // This should work, but if it doesn't...

    // If it still doesn't show, convert moment to native JS Date
    formGroup.get(formControlName)?.setValue(updatedDate.toDate()); // <-- Convert to native JS Date

    datepicker.close();
  }
}
