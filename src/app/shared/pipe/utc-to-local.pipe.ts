import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {

  transform(value: any, format: string = 'shortTime'): any {
    if (!value) {
      return '';
    }

    // Assuming the input `value` is a UTC date string. Appending 'Z' ensures it's parsed as UTC.
    const utcDate = new Date(value + 'Z');
    
    // The browser's `toLocaleString` or `toLocaleTimeString` will use the user's local timezone
    if (format === 'shortTime') {
      return utcDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    
    if (format === 'MMM dd,YYYY') {
        return utcDate.toLocaleDateString(undefined, {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    // Fallback for other formats, though you might want to expand this
    return utcDate.toLocaleString();
  }

}
