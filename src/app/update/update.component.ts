import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { DatashareService } from '../datashare.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  Userdataraw: any = localStorage.getItem('userdetails');
  Userdata: any = JSON.parse(this.Userdataraw);
  fundList: any;
  fundlistfordomain: any = [];
  showSuccessSignin = false;
  emailexists: boolean = false;
  token: any;
  userDetails: any;
  DomainList: any = ['@camsonline.com', '@kfintech.com', '@gmail.com'];
  userDomain: any;

  adminList: any;
  adminListdomain: any = [];
  public userfunds: string[] = [];

  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getToken();
    this.getUserDetails();

    this.registerForm = this.formBuilder.group({
      fullName: [
        '',
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
      email: [
        '',
        [
          Validators.required,
          // Validators.email,
          // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          // Validators.pattern('^[a-z0-9._%+-]+@camsonline.com$'),
          Validators.pattern('^[a-zA-Z0-9._-]+$'),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      fund: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      domain: [null, [Validators.required]],
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  emailchange() {
    this.emailexists = false;
  }

  printinput() {
    let input = {
      fullname: this.f.fullName.value,
      email: this.f.email.value + '@camsonline.com',
      fund: this.f.fund.value,
      admin: this.f.admin.value,
    };
    // console.log(input);
  }

  getAdmin(data: null) {
    this.authservice.getAdminList(data).subscribe(
      (res) => {
        this.adminList = res;
        // console.log(res);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  getFunds() {
    this.authservice.getfundList().subscribe(
      (res) => {
        this.fundList = res.value;
        // console.log(this.fundList);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  getToken() {
    this.authservice.getToken().subscribe(
      (res) => {
        this.token = res;
        // console.log('signup token', this.token);
        localStorage.setItem('singupToken', JSON.stringify(this.token.value));
        this.getAllfunds();
        this.getAdmin(null);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  getAllfunds() {
    this.authservice.getAllfundList().subscribe(
      (res) => {
        this.fundList = res.value;
        console.log('fundlist', this.fundList);
        // this.userfunds = ['FUND240'];

        this.domainvalue();
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.f);

    // this.showSuccessSignin = true;
  }

  signup() {
    this.submitted = true;
    this.emailexists = false;
    let funds: any = [];

    // stop here if form is invalid
    if (
      this.registerForm.invalid ||
      this.f.admin.status == 'INVALID' ||
      this.f.fund.status == 'INVALID' ||
      this.f.email.status == 'INVALID'
    ) {
      console.log('error');
      console.log(this.f);
      return;
    }
    console.log('test', this.f);

    this.f.fund.value.map((item: string) => funds.push({ fundid: item }));

    ////////api call
    let input = {
      email: 'update_' + this.userDetails.email,
      adminid: this.f.admin.value,
      name: this.f.fullName.value,
      Action: 'Signup',
      fundList: funds,
    };
    localStorage.setItem('UpdateDetails', JSON.stringify(input));

    console.log('update', input);

    this.authservice.signup(input).subscribe(
      (res) => {
        console.log('update fund response', res);

        localStorage.setItem('UpdateResponse', JSON.stringify(res));
        // this.router.navigate(['update-otp']);
        this.router.navigate(['update-otp']);
      },
      (err) => {
        console.log('already', err.error);
        this.emailexists = true;
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
        let email = this.userDetails.email.split('@')[0];
        this.userDomain = this.userDetails.email.split('@')[1];
        console.log('user details ', this.userDetails, this.userDomain);

        this.f.email.setValue(email);
        this.f.fullName.setValue(this.userDetails.name);
      },
      (err) => {}
    );
  }
  getUserFunds() {
    let input = {
      UserId: +this.Userdata.userUuid,
    };
    this.authservice.updateProfileGetAllFunds(input).subscribe(
      (res) => {
        console.log('user funds ', res);
        let input: any = [];
        // input.push('FUND240');
        res.map((item: any) => {
          return input.push(item.fundId);
        });

        input = input.filter((item: any) =>
          this.fundList.some((fund: any) => fund['fundID'] == item)
        );

        this.userfunds = input;
        console.log(this.userfunds, 'same funds');
      },
      (err) => {}
    );
  }
  updatefunds() {
    console.log(this.userfunds, this.fundList);
    this.submitted = true;
    if (
      this.registerForm.invalid ||
      this.f.admin.status == 'INVALID' ||
      this.f.fund.status == 'INVALID' ||
      this.f.email.status == 'INVALID'
    ) {
      console.log('error');

      return;
    }

    localStorage.setItem('userFunds', JSON.stringify(this.userfunds));
    // this.router.navigate(['update-otp']);
  }

  domainchange() {
    // get funds according to domain
    this.fundlistfordomain = [];
    this.adminListdomain = [];
    this.f.fund.reset();
    this.f.admin.reset();
    this.submitted = false;
    if (this.userDomain == '@camsonline.com') {
      this.fundlistfordomain = this.fundList.filter((item: any) => {
        console.log('domain changed');
        return item.rtaType == 'Cams';
      });
      this.adminListdomain = this.adminList.filter((item: any) => {
        console.log('domain changed');
        return item.userType == 'Cams Admin';
      });
    }
    if (this.userDomain == '@kfintech.com') {
      this.fundlistfordomain = this.fundList.filter((item: any) => {
        return item.rtaType == 'KFIN';
      });
      this.adminListdomain = this.adminList.filter((item: any) => {
        return item.userType == 'KFin Admin';
      });
    }

    console.log('update domain', this.fundlistfordomain, this.adminListdomain);
  }
  domainvalue() {
    // get funds according to domain

    if (this.userDomain == 'binmile.com') {
      this.fundlistfordomain = this.fundList.filter((item: any) => {
        console.log('domain changed');
        return item.rtaType == 'Cams';
      });
      this.adminListdomain = this.adminList.filter((item: any) => {
        console.log('domain changed');
        return item.userType == 'Cams Admin';
      });
    }
    if (this.userDomain == 'camsonline.com') {
      this.fundlistfordomain = this.fundList.filter((item: any) => {
        console.log('domain changed');
        return item.rtaType == 'Cams';
      });
      this.adminListdomain = this.adminList.filter((item: any) => {
        console.log('domain changed');
        return item.userType == 'Cams Admin';
      });
    }
    if (this.userDomain == 'kfintech.com') {
      this.fundlistfordomain = this.fundList.filter((item: any) => {
        return item.rtaType == 'KFIN';
      });
      this.adminListdomain = this.adminList.filter((item: any) => {
        return item.userType == 'KFin Admin';
      });
    }

    this.getUserFunds();

    console.log('update domain', this.fundlistfordomain, this.adminListdomain);
  }
}
