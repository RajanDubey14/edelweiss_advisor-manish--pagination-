import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  [x: string]: any;
  title = 'EdelWeiss Advisor';
  // fundList: [{id: number, name: string}] = [
  //   {id: 1, name: 'Mutual Fund'}
  // ];
  constructor(private fb: FormBuilder) {}
}
