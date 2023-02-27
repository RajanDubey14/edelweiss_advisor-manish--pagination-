import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customnumber',
})
export class CustomnumberPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let x = value;
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    return res;
  }
}
