import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private count = 0;
  private spinner$ = new BehaviorSubject<string>('');

  constructor() {}

  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    if (++this.count === 1) {
      this.spinner$.next('start');
      // console.log("spinner start")
    }
  }

  requestEnded() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next('stop');
      // console.log("spinner stop")
    }
  }

  resetSpinner() {
    this.count = 0;
    this.spinner$.next('stop');
  }
}
