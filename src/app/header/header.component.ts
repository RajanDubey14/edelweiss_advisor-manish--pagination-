import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: any;
  initial1: string = '';
  initial2: string = '';

  isHidden = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.getname();
    this.userName = localStorage.getItem('userName');
    this.initial1 = this.userName.split('')[0][0];
    this.initial2 = this.userName.split(' ')[1][0];
    // console.log('header', this.userName);
  }

  logout() {
    // console.log('logout');
    // return;
    localStorage.removeItem('session-token');
    localStorage.clear();
    this.checkLogOut();
    // console.log('logout');
  }
  checkLogOut() {
    const token = localStorage.getItem('session-token');
    if (!token) {
      this.router.navigate(['login']);
    }
  }
}
