import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-update-otp',
  templateUrl: './update-otp.component.html',
  styleUrls: ['./update-otp.component.css'],
})
export class UpdateOtpComponent implements OnInit {
  registerForm: FormGroup;
  showSuccessSignin = false;
  submitted = false;
  invalidOtp = false;
  admin: any = [{ email: '' }];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.registerForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9 ]{4}')]],
    });
    this.getAdmin(null);
  }

  checkLogin() {
    const token = localStorage.getItem('session-token');
    if (token) {
      this.router.navigate(['dashboard']);
    }
  }

  getAdmin(data: null) {
    let details: any = localStorage.getItem('singupResponse');
    let adminDetails = JSON.parse(details);
    this.authservice.getAdminList(data).subscribe(
      (res) => {
        this.admin = res.filter(
          (element: any) => element.id === +adminDetails.userUuid
        );

        console.log(this.admin);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  get f() {
    return this.registerForm.controls;
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

  test() {
    let data: any = localStorage.getItem('userdetails');
    let session = JSON.parse(data);
    console.log(session);
  }
  resendOtp() {
    let data: any = localStorage.getItem('singupDetails');
    let userDetails = JSON.parse(data);
    let input = {
      email: userDetails.email,
      adminid: userDetails.adminid,
      name: userDetails.name,
      Action: 'Signup',
      fundlist: [
        {
          fundid: userDetails.fundList[0].fundid,
        },
      ],
    };

    this.authservice.signup(input).subscribe(
      (res) => {
        console.log('resent', res);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  verify() {
    let data: any = localStorage.getItem('singupDetails');
    let userDetails = JSON.parse(data);
    let input = {
      otp: Number(this.f.otp.value),
      email: userDetails.email,
      adminid: userDetails.adminid,
      name: userDetails.name,
      Action: userDetails.Action,
      fundList: userDetails.fundList,
    };
    console.log('verify otp', input);

    this.authservice.verifySignupOtp(input).subscribe(
      (res) => {
        console.log(res);
        let loginput = {
          UserId: 0,
          EmailId: userDetails.email,
          ActivityType: 'SignUp',
          InvestmentId: '',
        };
        this.logs(loginput);
        this.showSuccessSignin = true;
        //localStorage.setItem('session-token', res.token);
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
      },
      (err) => {
        this.invalidOtp = true;
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
}
