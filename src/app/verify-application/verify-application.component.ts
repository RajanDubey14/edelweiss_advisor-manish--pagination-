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

  checker1: boolean = false;
  checker2: boolean = true;
  applicationId: any = '';
  pledgeId: any = '';
  category: any = '';
  showData: any = [];
  pledgeData: any;
  unpledgeData: any;

  data: any = '';
  user_name: string = 'User_Name';
  zoomleft: number = 1;
  zoomright: number = 1;
  zoom: number = 70;
  zoommodal: number = 1;
  resubmitted: boolean = false;
  selectedItem: any;

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
  checklist: any = [];
  checklistError: boolean = false;

  modalRef: BsModalRef | undefined;
  modalRef1: BsModalRef | undefined;
  modalRef2: BsModalRef | undefined;
  modalRef3: BsModalRef | undefined;
  modalRef4: BsModalRef | undefined;
  modalRef5: BsModalRef | undefined;

  @ViewChild('confirmSubmit', { static: false }) confirmSubmit: any;

  @ViewChild('confirmReSubmit', { static: false }) confirmReSubmit: any;

  @ViewChild('savedSuccessfully', { static: false }) savedSuccessfully: any;

  @ViewChild('verified', { static: false }) verified: any;

  @ViewChild('ReSubmit', { static: false }) ReSubmit: any;

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
    let param = atob(this.activatedRoute.snapshot.params['id']).split('&');
    this.applicationId = param[0];
    this.pledgeId = param[1];
    this.category = param[2];

    console.log(
      this.applicationId,
      'appID with PledgeId',
      this.pledgeId,
      param
    );

    let input = {
      recordType: '',
      month: '',
      year: 0,
      category: '',
      globalsearch: '',
    };

    this.authservice.getApplicationsWithFilter(input).subscribe(
      (res) => {
        this.showData = res.data.filter((item: any) => {
          return (
            item.applicationNumber === this.applicationId &&
            item.pledgeId === this.pledgeId
          );
        })[0];
        console.log('showdata ...................', this.showData);

        if (this.pledgeId !== '') {
          this.pledgeAndunpledge(this.pledgeId);
        }
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
    this.checklistError = false;

    if (this.category == 'Pledge') {
      let checklistvalue: any = [];
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          checklistvalue.push('');
          return;
        }
      });
      if (checklistvalue.length !== this.checklist.length) {
        console.log(checklistvalue);
        console.log('select alll check list');
        this.checklistError = true;
        return;
      }
    }

    if (this.category == 'Unpledge') {
      let checklistvalue: any = [];
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          checklistvalue.push('');
          return;
        }
      });
      if (checklistvalue.length !== this.checklist.length) {
        console.log(checklistvalue);
        console.log('select alll check list');
        this.checklistError = true;
        return;
      }
    }
    this.checklistError = false;
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

    if (this.category == 'Pledge') {
      let checklistvalue: any = [];
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          checklistvalue.push('');
          return;
        }
      });
      if (checklistvalue.length !== this.checklist.length) {
        console.log(checklistvalue);
        console.log('select alll check list');
        this.checklistError = true;
        return;
      }
    }

    if (this.category == 'Unpledge') {
      let checklistvalue: any = [];
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          checklistvalue.push('');
          return;
        }
      });
      if (checklistvalue.length !== this.checklist.length) {
        console.log(checklistvalue);
        console.log('select alll check list');
        this.checklistError = true;
        return;
      }
    }

    this.resubmitted = false;
    this.checklistError = false;

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

  rightside() {
    let input: any = {
      // InvestmentId: this.showData.investmentID,
      // InvestmentId: 1490,
      // UserId: this.showData.userId,
      InvestmentId: this.showData.investmentID,
      Doctype: '',
      UserId: this.showData.userId,
    };

    if (this.category == 'Pledge') {
      input = {
        Pledgeid: +this.pledgeId,
        InvestmentId: +this.showData.investmentID,
        UserId: +this.showData.userId,
        Doctype: 'pledge',
      };
    }

    if (this.category == 'Unpledge') {
      input = {
        InvestmentId: +this.showData.investmentID,
        Pledgeid: +this.pledgeId,
        UserId: +this.showData.userId,
        Doctype: 'pledge',
      };
    }

    console.log(input);
    this.authservice.getPDFFile(input).subscribe(
      (res) => {
        // console.log('right side data', res);
        this.scrRight = res.data;
        this.scrRight.sort(
          (a: any, b: any) => a.documentType.length - b.documentType.length
        );
        console.log('all documents', this.scrRight);

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
        console.log('images', this.scrRightImages);
        console.log('pdf', this.scrRightPdf);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  save() {
    let discripancy: any = [];
    this.scrRight.forEach((item: any) => {
      if (!item.checked) {
        discripancy.push({ docName: item.documentType, discripancyStatus: 0 });
      } else {
        discripancy.push({ docName: item.documentType, discripancyStatus: 1 });
      }
    });
    let input: any = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'save',
      RequestType: 'Cams',
      PledgeId: 0,
      docDiscrepancyStatuses: discripancy,
    };

    if (this.category == 'Pledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: '',
        RequestType: 'pledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      console.log('default checklist', this.checklist);
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    if (this.category == 'Unpledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: '',
        RequestType: 'unpledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    console.log(input);

    // testing

    // console.log(input);
    // setTimeout(() => {

    // }, 4000);

    this.authservice.submit(input).subscribe(
      (res) => {
        // console.log(res);
        this.showsavedSuccessfully(this.savedSuccessfully);
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
    let discripancy: any = [];
    this.scrRight.forEach((item: any) => {
      if (!item.checked) {
        discripancy.push({ docName: item.documentType, discripancyStatus: 0 });
      } else {
        discripancy.push({ docName: item.documentType, discripancyStatus: 1 });
      }
    });

    let input: any = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'recheck',
      RequestType: 'Cams',
      PledgeId: 0,
      docDiscrepancyStatuses: discripancy,
    };

    if (this.category == 'Pledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'recheck',
        RequestType: 'pledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    if (this.category == 'Unpledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'recheck',
        RequestType: 'unpledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    console.log(input);

    this.authservice.submit(input).subscribe(
      (res) => {
        // console.log(res);
        this.showSuccessfullyResubmitModal(this.ReSubmit);

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
    let discripancy: any = [];
    this.scrRight.forEach((item: any) => {
      if (!item.checked) {
        discripancy.push({ docName: item.documentType, discripancyStatus: 0 });
      } else {
        discripancy.push({ docName: item.documentType, discripancyStatus: 1 });
      }
    });
    let input: any = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'approve',
      RequestType: 'Cams',
      PledgeId: 0,
      docDiscrepancyStatuses: discripancy,
    };

    if (this.category == 'Pledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'approve',
        RequestType: 'pledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    if (this.category == 'Unpledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'approve',
        RequestType: 'unpledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    console.log(input);

    this.authservice.submit(input).subscribe(
      (res) => {
        this.showVerifiedModal(this.verified);
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

  pledgeAndunpledge(data: any) {
    let input = {
      PledgeId: +data,
    };

    this.authservice.getPledgeAndUnpledgeData(input).subscribe(
      (res) => {
        this.pledgeData = res[0];
        console.log('pledge data', this.pledgeData);
        this.getUnpledgeinvestordata();

        this.getChecklst(data);
        this.getChecklist2(data);
      },
      (err) => {}
    );
  }

  getUnpledgeinvestordata() {
    this.authservice.irdashboardData().subscribe(
      (res) => {
        let irdata = res;
        let output = irdata.filter((item: any) => {
          return (
            item.pan == this.pledgeData.pan &&
            item.folioNo == this.pledgeData.folioNo &&
            item.fundId == this.pledgeData.fundId &&
            item.financerName == this.pledgeData.financerName &&
            item.requestStatus == 'Done'
          );
        });
        console.log('irdata and filterdata', irdata, output);
      },
      (err) => {}
    );
  }

  async getChecklst(id: any) {
    let input = {
      ListType: this.category,
    };

    this.authservice.irChecklist(input).subscribe(
      (res) => {
        this.checklist = res;

        console.log(res, 'checklist');
        this.getChecklist2(id);
      },
      (err) => {}
    );
  }

  consolecheck() {
    console.log(this.checklist);
  }

  getChecklist2(id: any) {
    let input = {
      ListType: this.category,
      PledgeId: +id,
    };

    this.authservice.irChecklistwithId(input).subscribe(
      (res) => {
        if (res.length == 0) {
          // this.getChecklst();
        }
        if (res.length !== 0) {
          let reponse = res;
          // this.checklist = res;

          this.checklist.forEach((item: any, index: any) => {
            item.value =
              reponse[
                reponse.findIndex((i: any) => i.checkListId == item.checkListId)
              ].checkListValue.toString();
          });
        }

        console.log('checklist preselect', this.checklist);
      },
      (err) => {}
    );
  }

  showdocument(index: any) {
    this.selectedItem = index;
    this.scrRightImages = [];
    this.scrRightPdf = [];

    let output = this.scrRight[index];

    if (!output.documentName.includes('.pdf')) {
      this.scrRightImages.push(output);
      console.log('click image work', output.documentName, this.scrRightImages);
    } else {
      this.scrRightPdf.push(output);
      console.log('click pdf work', output.documentName, this.scrRightPdf);
    }
  }

  check() {
    let discripancy: any = [];
    this.scrRight.forEach((item: any) => {
      if (!item.checked) {
        discripancy.push({ docName: item.documentType, discripancyStatus: 0 });
      } else {
        discripancy.push({ docName: item.documentType, discripancyStatus: 1 });
      }
    });
    console.log(discripancy);
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  submittochecker2() {
    let discripancy: any = [];
    this.scrRight.forEach((item: any) => {
      if (!item.checked) {
        discripancy.push({ docName: item.documentType, discripancyStatus: 0 });
      } else {
        discripancy.push({ docName: item.documentType, discripancyStatus: 1 });
      }
    });
    let input: any = {
      InvestmentId: this.showData.investmentID,
      UserId: this.showData.userId,
      Remark: this.comment,
      type: 'approve',
      RequestType: 'Cams',
      PledgeId: 0,
      docDiscrepancyStatuses: discripancy,
    };

    if (this.category == 'Pledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'approve',
        RequestType: 'pledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    if (this.category == 'Unpledge') {
      input = {
        InvestmentId: this.showData.investmentID,
        UserId: this.showData.userId,
        Remark: this.comment,
        type: 'approve',
        RequestType: 'unpledge',
        PledgeId: +this.pledgeId,
        checkList: [],
        docDiscrepancyStatuses: discripancy,
      };
      this.checklist.map((item: any) => {
        if (item.value == 0 || item.value == 1) {
          return input.checkList.push({
            checkListId: item.checkListId,
            checkListVal: +item.value,
          });
        }
      });
    }

    console.log(input);

    this.authservice.submit(input).subscribe(
      (res) => {
        this.showVerifiedModal(this.verified);
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
}
