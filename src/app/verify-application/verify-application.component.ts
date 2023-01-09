import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthServiceService } from '../auth-service.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-verify-application',
  templateUrl: './verify-application.component.html',
  styleUrls: ['./verify-application.component.css'],
})
export class VerifyApplicationComponent implements OnInit, AfterViewInit {
  @ViewChild('iframe') iframe: ElementRef;
  applicationId: any = '';
  showData: any = [];
  data: any = '';
  user_name: string = 'User_Name';
  zoomleft: number = 1;
  zoomright: number = 1;
  zoom: number = 75;
  zoommodal: number = 1;
  resubmitted: boolean = false;

  src: any = '';
  pdflink: any = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.src + `#toolbar=1&zoom=${this.zoom}`
  );

  scrRight: any = [];
  scrRightImages: any = [];
  scrRightPdf: any = [];
  images = [
    {
      name: 'Image 1',
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/A_sample_of_Permanent_Account_Number_%28PAN%29_Card.jpg',
    },
  ];

  comment: string = '';

  modalRef: BsModalRef | undefined;
  modalRef1: BsModalRef | undefined;
  modalRef2: BsModalRef | undefined;
  modalRef3: BsModalRef | undefined;
  modalRef4: BsModalRef | undefined;
  modalRef5: BsModalRef | undefined;

  @ViewChild('confirmSubmit', { static: false }) confirmSubmit:
    | TemplateRef<any>
    | undefined;

  @ViewChild('savedSuccessfully', { static: false }) savedSuccessfully:
    | TemplateRef<any>
    | undefined;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authservice: AuthServiceService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getDatas();

    // console.log('atob', atob(this.activatedRoute.snapshot.params['id']));
  }

  ngAfterViewInit() {}

  getDatas() {
    this.applicationId = atob(this.activatedRoute.snapshot.params['id']);

    this.authservice.getApplications2().subscribe(
      (res) => {
        this.showData = res.data.filter((item: any) => {
          return item.applicationNumber === this.applicationId;
        })[0];
        console.log('showdata ...................', this.showData);
        let data: any = localStorage.getItem('userdetails');
        let userDetails = JSON.parse(data);
        let logsinput = {
          UserId: +userDetails.userUuid,
          EmailId: userDetails.email,
          ActivityType: 'Opened',
          InvestmentId: this.showData.investmentID.toString(),
        };
        this.logs(logsinput);
        this.comment = this.showData.remarks;
        // console.log(
        //   'verify application',
        //   this.activatedRoute.snapshot.params['id'],
        //   this.showData
        // );
        // console.log('before loading pdf');
        this.leftside();
        this.rightside();

        // console.log('userdetails', this.showData);
        //this.getInformation(this.applicationId);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  getInformation(id: any) {
    let user = this.data.filter((obj: any) => obj.applicationNumber === id);
    this.showData = user[0];
    // console.log(this.showData);
  }

  zoominleft() {
    if (this.zoom < 200) {
      this.zoom += 25;
      this.pdflink = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.src + `#toolbar=1&zoom=${this.zoom}`
      );
      // console.log(this.zoom);
      // console.log(this.pdflink);
    }
  }
  zoomoutleft() {
    if (this.zoom > 50) {
      this.zoom -= 25;
    }
  }
  zoominright() {
    if (this.zoomright < 5) {
      this.zoomright++;
    }
  }
  zoomoutright() {
    if (this.zoomright > 1) {
      this.zoomright--;
    }
  }

  zoominmodal() {
    if (this.zoommodal < 5) {
      this.zoommodal++;
    }
  }
  zoomoutmodal() {
    if (this.zoommodal > 1) {
      this.zoommodal--;
    }
  }

  showConfirmModal(template: TemplateRef<any>) {
    this.resubmitted = false;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
  }
  showsavedSuccessfully(template: TemplateRef<any>) {
    this.resubmitted = false;
    this.modalRef1 = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
    setTimeout(() => {
      this.modalService.hide();
      this.router.navigate(['dashboard']);
    }, 3000);
  }

  showResubmitModal(template: TemplateRef<any>) {
    if (this.comment == '' || this.comment == null) {
      this.resubmitted = true;
      return;
    }
    this.resubmitted = false;

    this.modalRef2 = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
  }

  showVerifiedModal(template: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
    setTimeout(() => {
      this.modalService.hide();
      this.router.navigate(['dashboard']);
    }, 3000);
  }

  modalremove() {
    this.modalService.hide();
  }

  showSuccessfullyResubmitModal(template: TemplateRef<any>) {
    this.modalRef4 = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
    setTimeout(() => {
      this.modalService.hide();
      this.router.navigate(['dashboard']);
    }, 3000);
  }
  showSuccessfullyfullSizeModal(template: TemplateRef<any>) {
    this.modalRef4 = this.modalService.show(
      template,
      Object.assign({ class: 'gray modal-lg' })
    );
  }

  async leftside() {
    let input = {
      formId: this.showData.applicationNumber,
      // formId: 'CP-22-1489',
      InvestmentId: this.showData.investmentID.toString(),
      // InvestmentId: '1490',
    };
    await this.authservice.getPDF(input).subscribe(
      (res) => {
        this.src = res.message;
        this.pdflink = this.sanitizer.bypassSecurityTrustResourceUrl(
          res.message + '#toolbar=1'
        );
        // console.log('left pdf ', this.pdflink);
      },
      (err) => {
        console.log('left pdf ', err.error);
      }
    );
  }

  async rightside() {
    let input = {
      // InvestmentId: this.showData.investmentID,
      // InvestmentId: 1490,
      // UserId: this.showData.userId,
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
    };
    // console.log(input);
    await this.authservice.getPDFFile(input).subscribe(
      (res) => {
        // console.log('right side data', res);
        this.scrRight = res.data;
        this.scrRightImages = res.data.filter(
          (item: any) => !item.documentName.includes('.pdf')
        );
        this.scrRightPdf = res.data.filter((item: any) =>
          item.documentName.includes('.pdf')
        );
        this.scrRightImages.map((item: any) => {
          return (item.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            item.fileURL
          ));
        });
        this.scrRightPdf.map((item: any) => {
          return (item.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            item.fileURL + '#toolbar=1'
          ));
        });
        // console.log('images', this.scrRightImages);
        // console.log('pdf', this.scrRightPdf);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  save() {
    let input = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'save',
    };

    // console.log(input);
    // setTimeout(() => {

    // }, 4000);

    this.authservice.submit(input).subscribe(
      (res) => {
        // console.log(res);
        let data: any = localStorage.getItem('userdetails');
        let userDetails = JSON.parse(data);
        let logsinput = {
          UserId: +userDetails.userUuid,
          EmailId: userDetails.email,
          ActivityType: 'Save as Draft',
          InvestmentId: this.showData.investmentID.toString(),
        };
        this.logs(logsinput);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  resubmit() {
    let input = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'recheck',
    };

    this.authservice.submit(input).subscribe(
      (res) => {
        // console.log(res);
        let data: any = localStorage.getItem('userdetails');
        let userDetails = JSON.parse(data);
        let logsinput = {
          UserId: +userDetails.userUuid,
          EmailId: userDetails.email,
          ActivityType: 'Resubmitted',
          InvestmentId: this.showData.investmentID.toString(),
        };
        this.logs(logsinput);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  submit() {
    let input = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remarks: this.comment,
      type: 'approve',
    };

    this.authservice.submit(input).subscribe(
      (res) => {
        // console.log(res);
        let data: any = localStorage.getItem('userdetails');
        let userDetails = JSON.parse(data);
        let logsinput = {
          UserId: +userDetails.userUuid,
          EmailId: userDetails.email,
          ActivityType: 'Approved',
          InvestmentId: this.showData.investmentID.toString(),
        };
        this.logs(logsinput);
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
}
