import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

//import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  recordType: string;
  month: string;
  year: number;
  category: string;
  globalsearch: string;
  downloadsrc: string;

  showData: any = [];
  pageSlice: any = [];
  monthandyear: any = [];
  categories: any;

  Resubmittedbutton: string = 'Resubmitted';
  verifiedbutton: string = 'Verified';
  onboardedbutton: string = 'Onboarded';

  getData: any = [];
  searchText: any;
  space = '&';
  submittedCount: number;
  ResubmittedCount: number;
  recheckCount: number;
  recheckpendingCount: number;
  verifiedCount: number;
  onboardedCount: number;
  isActive: boolean = false;
  fundList: [{ id: number; name: string }] = [{ id: 1, name: 'Mutual Fund' }];
  items = new Array(10);
  //pagination variables
  pageSize: number = 20;
  pageLength: number = this.showData.length;
  pageIndex: number = 1;
  PreviousPageIndex: number = 0;
  startIndex: number = 0;
  remaining: number = 0;
  endIndex: number = this.pageSize;
  // pagesize: any = this.showData.length;
  // total: any = this.showData.length;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {
    // this.checkLogOut();
    this.getDatas();
    this.getmonthandyear();
    this.getCategories();
    // this.default(null);
    this.SubmittedtoCams();

    // console.log(this.pageSlice);
  }

  checkLogOut() {
    const token = localStorage.getItem('session-token');
    if (!token) {
      this.router.navigate(['login']);
    }
  }

  getDatas() {
    this.authservice.getApplications2().subscribe(
      (res) => {
        // console.log('applications', res);
        this.getData = res.data;
        this.default(null);
        this.count();
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  getmonthandyear() {
    this.authservice.getmonthandyear().subscribe(
      (res) => {
        this.monthandyear = res.data;
        this.monthandyear.map((item: any) => {
          item.monthname = item.monthname.split(' ')[3];
        });
        // console.log('month and year', this.monthandyear);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
  getCategories() {
    this.authservice.getCategories().subscribe(
      (res) => {
        this.categories = res.data;
        this.categories.map((item: any) => {
          item.category = item.category.split(' ')[3];
        });

        // console.log('categories', this.categories);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  count() {
    let submitted = this.getData.filter(
      (obj: any) =>
        obj.recordtype == 'Submitted to CAMS' &&
        obj.status === 'Submitted to CAMS'
    );
    let Resubmitted = this.getData.filter(
      (obj: any) => obj.recordtype == 'Resubmitted'
    );
    let rechecknew = this.getData.filter(
      (obj: any) => obj.recordtype == 'Recheck New'
    );
    let recheckpending = this.getData.filter(
      (obj: any) => obj.recordtype == 'Recheck Pending'
    );
    let verified2 = this.getData.filter(
      (obj: any) => obj.recordtype == 'Verified'
    );
    let onboarded = this.getData.filter(
      (obj: any) => obj.recordtype == 'Onboarded'
    );
    this.submittedCount = submitted.length;
    this.ResubmittedCount = Resubmitted.length;
    this.recheckCount = rechecknew.length;
    this.recheckpendingCount = recheckpending.length;
    this.verifiedCount = verified2.length;
    this.onboardedCount = onboarded.length;
    // console.log('count', onboarded);
  }
  default(data: any) {
    let input = {
      recordType: '',
      month: '',
      year: 0,
      category: '',
      globalsearch: '',
    };

    this.authservice.getApplicationsWithFilter(input).subscribe(
      (res) => {
        this.showData = res.data.filter(
          (obj: any) =>
            (obj.recordtype == 'Submitted to CAMS' &&
              obj.status === 'Recheck') ||
            (obj.recordtype == 'Submitted to CAMS' &&
              obj.status === 'Submitted to CAMS')
        );
        // console.log('default', this.showData);
        this.count();
        this.pageSlice = this.showData.slice(0, this.pageSize);
      },
      (err) => {
        console.log(err.error);
      }
    );

    return;
  }
  SubmittedtoCams() {
    this.recordType = 'Submitted to CAMS';
    this.global();
  }
  ReSubmittedtoCams() {
    this.recordType = 'Resubmitted';
    this.global();
  }

  Rechecknew() {
    this.recordType = 'Recheck New';
    this.global();
  }
  Recheckpending() {
    this.recordType = 'Recheck Pending';
    this.global();
  }

  Verified() {
    this.recordType = 'Verified';

    this.global();
  }

  onboarded() {
    this.recordType = 'Onboarded';

    this.global();
  }

  searchchange(event: any) {
    if (event.target.value == '') {
      this.global();
      return;
    }
    // this.recordType = '';
    // this.month = '';
    // this.year = 0;
    // this.category = '';
    this.globalsearch = event.target.value;

    this.global();
    // this.startIndex = 0;
    // this.endIndex = this.pageSize;

    // if (event.target.value != '') {

    // }
  }
  hello() {
    if (this.searchText == '') {
      // console.log('hello empty');
      this.globalsearch = '';

      this.global();
      return;
    }
    // console.log('hello from search change');
  }

  categorychange(event: any) {
    let input = event.target.value;
    this.category = input;
    // console.log('category', this.category);
    this.global();
  }

  monthchange(event: any) {
    let input = event.target.value;
    let output = input.split('-');

    this.month = output[0];
    this.year = +output[1];
    this.global();
  }

  global() {
    let input = {
      recordType: this.recordType,
      month: this.month,
      year: this.year,
      category: this.category,
      globalsearch: this.globalsearch,
    };
    // console.log('global', input);
    this.authservice.getApplicationsWithFilter(input).subscribe(
      (res) => {
        console.log(this.recordType, this.globalsearch, res);

        this.showData = res.data;
        this.startIndex = 0;
        this.endIndex = this.pageSize;
        this.pageIndex = 1;
        this.pageSlice = this.showData.slice(this.startIndex, this.endIndex);
      },
      (err) => {
        this.showData = [];
        this.startIndex = 0;
        this.endIndex = this.pageSize;
        this.pageIndex = 1;
        this.pageSlice = this.showData.slice(this.startIndex, this.endIndex);
        console.log(err.error);
      }
    );

    return;
  }
  verifyAppication(event: any) {
    let input = btoa(event);
    this.router.navigate([`verify-application/${input}`]);
    // console.log('verify application', input);
  }

  pageLimit(event: any) {
    this.pageSize = +event.target.value;
    this.startIndex = 0;
    this.endIndex = this.pageSize;
    this.pageIndex = 1;
    this.global();
  }

  onPageChangePlus() {
    if (this.startIndex + this.pageSize < this.showData.length) {
      this.startIndex = this.pageIndex * this.pageSize;

      this.pageIndex++;
      this.endIndex = this.startIndex + this.pageSize;
      if (this.endIndex > this.showData.length) {
        this.endIndex = this.showData.length;
      }
      // console.log(this.startIndex, this.endIndex, this.remaining);
      this.pageSlice = this.showData.slice(this.startIndex, this.endIndex);
    }
  }
  onPageChangeMinus() {
    if (this.endIndex == this.showData.length) {
      let remaining: number = this.startIndex + this.pageSize;
      this.endIndex = remaining - this.pageSize;
      // console.log('hello pagination', remaining);
      this.startIndex = this.endIndex - this.pageSize;
      this.pageIndex--;
      if (this.startIndex < 0) {
        this.startIndex = 0;
      }
      // console.log(this.startIndex, this.endIndex);
      this.pageSlice = this.showData.slice(this.startIndex, this.endIndex);
    } else {
      if (this.startIndex > 0) {
        this.endIndex = this.endIndex - this.pageSize;
        this.startIndex = this.endIndex - this.pageSize;
        this.pageIndex--;
        if (this.startIndex < 0) {
          this.startIndex = 0;
        }
        // console.log(this.startIndex, this.endIndex);
        this.pageSlice = this.showData.slice(this.startIndex, this.endIndex);
      }
    }
  }

  async downloadverified(event: any) {
    console.log(event);

    let input = {
      formId: event.applicationNumber,
      // formId: 'CP-22-1489',
      InvestmentId: event.investmentID.toString(),
      // InvestmentId: '1490',
    };
    await this.authservice.getPDF(input).subscribe(
      (res) => {
        this.downloadsrc = res.message;
        let blob: any = this.downloadsrc;
        let a = document.createElement('a');
        a.href = blob;
        a.download = 'application';
        a.type = 'data:application/pdf';
        a.target = '_blank';
        a.click();
        console.log(this.downloadsrc);
        // this.pdflink = this.sanitizer.bypassSecurityTrustResourceUrl(
        //   res.message + '#toolbar=1'
        // );
        // console.log('left pdf ', this.pdflink);
      },
      (err) => {
        console.log('left pdf ', err.error);
      }
    );
  }
  downloadEsign(event: any) {
    let input = event.investmentID;
    console.log('Esign - input', input);

    this.authservice.getEsignPDF(input).subscribe(
      (res) => {
        let blob: any = res.message;
        let a = document.createElement('a');
        a.href = blob;
        a.download = 'application';
        a.target = '_blank';
        a.type = 'data:application/pdf';
        a.click();
        console.log('esign', res);
        // this.pdflink = this.sanitizer.bypassSecurityTrustResourceUrl(
        //   res.message + '#toolbar=1'
        // );
        // console.log('left pdf ', this.pdflink);
      },
      (err) => {
        console.log('left pdf ', err.error);
      }
    );
  }

  // onPageChangeMinus() {
  //   const endIndex = this.pageIndex * this.pageSize;
  //   let startIndex = endIndex - this.pageSize;
  //   if (startIndex < 0) {
  //     startIndex = 0;
  //   }
  //   console.log(startIndex, endIndex);
  //   this.pageSlice = this.showData.slice(startIndex, endIndex);
  // }
  // onPageChange(event: PageEvent) {
  //   console.log(event);
  //   const startIndex = event.pageIndex * event.pageSize;
  //   let endIndex = startIndex + event.pageSize;
  //   if (endIndex > this.showData.length) {
  //     endIndex = this.showData.length;
  //   }
  //   this.pageSlice = this.showData.slice(startIndex, endIndex);
  // }
}
