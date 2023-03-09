import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  invalidEmail = false;
  domain: any;
  DomainList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          // Validators.email,
          // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          // Validators.pattern('^[a-z0-9._%+-]+@camsonline.com$'),
          Validators.pattern('^[a-zA-Z0-9._-]+$'),
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      domain: [null, [Validators.required]],
    });
    this.getAllDomain();
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
    // console.log(this.registerForm.controls);
    if (this.registerForm.invalid) {
      // stop here if form is invalid
      //    console.log('invalid', this.f.email);
      //console.log('invalid', this.f.domain);

      return;
    }
    //  console.log(this.f.email);
    this.submitted = false;
    this.login();
  }

  login() {
    let input = {
      action: 'login',
      email: this.f.email.value + this.f.domain.value,
      // email: 'raghvendra@binmile.com',
    };
    // console.log(input);

    this.authservice.login(input).subscribe(
      (res) => {
        this.invalidEmail = false;
        // console.log(res);
        localStorage.setItem('userdetails', JSON.stringify(res));
        this.router.navigate(['confirm-otp']);
      },
      (err) => {
        this.invalidEmail = true;
        console.log(err.error);
      }
    );
  }
  loading() {
    let input = { action: 'login', email: this.f.email.value };
    this.authservice.login(input).subscribe(
      (res) => {
        this.invalidEmail = false;
        // console.log(res);
        localStorage.setItem('userdetails', JSON.stringify(res));
        this.router.navigate(['confirm-otp']);
      },
      (err) => {
        this.invalidEmail = true;
        console.log(err.error);
      }
    );
  }

  getAllDomain() {
    this.authservice.getDomain().subscribe(
      (res) => {
        this.DomainList = res;
        //console.log('all domain', this.DomainList);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
}
