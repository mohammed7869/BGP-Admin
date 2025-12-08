import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'sum',
  pure: false
})
export class SumPipe implements PipeTransform {
  transform(items: any[], attr: string, condition?: (item: any) => boolean): Observable<any> {
    return new Observable(observer => {
      const filteredItems = condition ? items.filter(condition) : items;
      const sum = filteredItems.reduce((a, b) => a + b[attr], 0);
      observer.next(sum);
      observer.complete();
    });
  }
}