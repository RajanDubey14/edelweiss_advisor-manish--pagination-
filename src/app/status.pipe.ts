import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value.toLocaleLowerCase() === 'submitted to cams') {
      return 'Submitted to R&T';
    }
    return value;
  }
}
