import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { SpinnerService } from './spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(req: any, next: any) {
    this.spinnerService.requestStarted();

    let token = localStorage.getItem('session-token');
    let singupToken: any = localStorage.getItem('singupToken');
    let tokeninzedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('token check', tokeninzedReq);
    if (
      tokeninzedReq.url ==
      'https://uatapis.edelweissalternatives.com/v1/api/Fund/getSwiftChildFund'
    ) {
      tokeninzedReq = req.clone({
        setHeaders: {
          Authorization: `${JSON.parse(singupToken)}`,
        },
      });
      // console.log('changed token');
      this.spinnerService.requestEnded();
      return next.handle(tokeninzedReq);
    }
    // console.log('token not change');

    // console.log('before spinner end');
    return next
      .handle(tokeninzedReq)
      .pipe(finalize(() => this.spinnerService.requestEnded()));
  }
}
