import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localPrecisionNumber'
})
export class LocalPrecisionNumberPipe implements PipeTransform {

  transform(value: number, precision = 0): unknown {
    return Number(value).toLocaleString('en-IN', { minimumFractionDigits: precision, currency: 'INR' });
  }
}
