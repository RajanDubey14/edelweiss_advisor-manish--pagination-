import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.css'],
})
export class ConfirmOtpComponent implements OnInit {
  registerForm: FormGroup;
  userDetails: any;
  childMessage: string = 'tesing123';
  submitted = false;
  invalidOtp = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.checkLogin();

    this.userDetail();
    this.registerForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9 ]{4}')]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }
  checkLogin() {
    const token = localStorage.getItem('session-token');
    if (token) {
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.submitted = false;
    this.verify();
  }

  userDetail() {
    let data: any = localStorage.getItem('userdetails');
    this.userDetails = JSON.parse(data);
    // console.log(this.userDetails);
  }
  resendOtp() {
    let data: any = localStorage.getItem('userdetails');
    let userDetails = JSON.parse(data);
    let input = { action: 'login', email: userDetails.email };
    this.authservice.login(input).subscribe(
      (res) => {
        // console.log('resent');
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  logs(input: any) {
    //collect logs

    this.authservice.logs(input).subscribe(
      (res) => {
        console.log('log saved', input, res);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  verify() {
    let data: any = localStorage.getItem('userdetails');
    let userDetails = JSON.parse(data);
    let input = {
      otp: String(this.f.otp.value),
      userUuid: userDetails.userUuid,
    };

    this.authservice.verifyOtp(input).subscribe(
      (res) => {
        let logsinput = {
          UserId: +userDetails.userUuid,
          EmailId: userDetails.email,
          ActivityType: 'login',
          InvestmentId: '',
        };
        this.logs(logsinput);

        // console.log('confirm otp page ', res);
        localStorage.setItem('session-token', res.token);
        localStorage.setItem('userName', res.userName);
        this.router.navigate(['dashboard']);
      },
      (err) => {
        this.invalidOtp = true;
        console.log(err.error);
      }
    );
  }
}
