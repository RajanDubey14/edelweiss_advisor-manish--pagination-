import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { UpdateComponent } from '../update/update.component';
import { DatashareService } from '../datashare.service';

@Component({
  selector: 'app-update-otp',
  templateUrl: './update-otp.component.html',
  styleUrls: ['./update-otp.component.css'],
})
export class UpdateOtpComponent implements OnInit {
  Userdataraw: any = localStorage.getItem('userdetails');
  Userdata: any = JSON.parse(this.Userdataraw);
  Userfundsraw: any = localStorage.getItem('userFunds');
  Userfunds: any = JSON.parse(this.Userfundsraw);
  userDetails: any;
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
    this.registerForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9 ]{4}')]],
    });
    this.getAdmin(null);
    this.getUserDetails();
    console.log('userdata', this.Userdata);
    console.log('userfunds', this.Userfunds);
  }

  getAdmin(data: null) {
    let details: any = localStorage.getItem('UpdateResponse');
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

  resendOtp() {
    let data: any = localStorage.getItem('UpdateDetails');
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
    let data: any = localStorage.getItem('UpdateDetails');
    let userDetailsLocal = JSON.parse(data);
    let input = {
      OTP: Number(this.f.otp.value),
      email: this.userDetails.email,
      AdminId: userDetailsLocal.adminid,
      Name: this.userDetails.name,
      UserId: this.userDetails.id,
      userFundsLists: userDetailsLocal.fundList,
    };

    console.log('update funds input ', input);

    this.authservice.updateProfileSetUserFunds(input).subscribe(
      (res) => {
        localStorage.removeItem('UpdateDetails');
        localStorage.removeItem('UpdateResponse');
        console.log('update profile response', res);
        let loginput = {
          UserId: 0,
          EmailId: this.userDetails.email,
          ActivityType: 'Updateprofile',
          InvestmentId: '',
        };
        this.logs(loginput);
        this.router.navigate(['dashboard']);
        // this.showSuccessSignin = true;
        // //localStorage.setItem('session-token', res.token);
        // setTimeout(() => {
        //   this.router.navigate(['dashboard']);
        // }, 3000);
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
  getUserDetails() {
    let input = {
      UserId: +this.Userdata.userUuid,
    };
    this.authservice.updateProfileGetDetails(input).subscribe(
      (res) => {
        this.userDetails = res[0];

        console.log('user details ', this.userDetails);
      },
      (err) => {}
    );
  }

  updatefunds() {
    let input = {
      UserId: this.userDetails.id,
      Name: this.userDetails.name,
      emailId: this.userDetails.email,
      userFundsLists: [{}],
    };
    this.Userfunds.map((item: any) => {
      input.userFundsLists.push({ fundId: item });
    });

    console.log('input for update funds', input);
    return;

    this.authservice.updateProfileSetUserFunds(input).subscribe(
      (res) => {},
      (err) => {}
    );
  }

  testdatapass() {
    console.log('its works');
  }
}
