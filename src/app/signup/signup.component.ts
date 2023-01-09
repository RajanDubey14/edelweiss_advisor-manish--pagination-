import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  fundList: any;
  showSuccessSignin = false;
  emailexists: boolean = false;
  token: any;

  adminList: any;

  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.getToken();

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
          Validators.pattern('^[a-z0-9._%+-]+$'),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      fund: [null, [Validators.required]],
      admin: [null, [Validators.required]],
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  emailchange() {
    this.emailexists = false;
  }

  checkLogin() {
    const token = localStorage.getItem('session-token');
    if (token) {
      this.router.navigate(['dashboard']);
    }
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
      email: this.f.email.value + '@camsonline.com',
      adminid: this.f.admin.value,
      name: this.f.fullName.value,
      Action: 'Signup',
      fundList: funds,
    };
    localStorage.setItem('singupDetails', JSON.stringify(input));

    console.log('signup', input);

    this.authservice.signup(input).subscribe(
      (res) => {
        console.log(res);

        localStorage.setItem('singupResponse', JSON.stringify(res));
        this.router.navigate(['signup-otp']);
      },
      (err) => {
        console.log('already', err.error);
        this.emailexists = true;
      }
    );
  }
}
