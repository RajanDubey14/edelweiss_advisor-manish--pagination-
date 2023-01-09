import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  token = localStorage.getItem('session-token');
  tokenAuth: string = 'Authorization';
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/user/login`,
      data
    );
  }

  signup(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/camsSignupOTP`,
      data
    );
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/auth/verify-otp`,
      data
    );
  }

  verifySignupOtp(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/Signup`,
      data
    );
  }

  getToken(): Observable<any> {
    let input = { accesskey: 'pdgenie' };
    return this.http.post(
      'https://uatapis.edelweissalternatives.com/api/authentication/GenerateToken',
      input
    );
  }

  getfundList(): Observable<any> {
    return this.http.get(
      'https://uatapis.edelweissalternatives.com/swiftapi/api/v1/external/getChildFund/FUND229'
    );
  }
  getAllfundList(): Observable<any> {
    return this.http.get(
      'https://uatapis.edelweissalternatives.com/v1/api/Fund/getSwiftChildFund'
    );
  }

  getAdminList(data: null): Observable<any> {
    return this.http.post(
      'https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/getadminlist',
      data
    );
  }

  getApplications(): Observable<any> {
    return this.http.get(`http://localhost:5550/api/products`);
  }

  getApplications2(): Observable<any> {
    return this.http.get(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/applicationList`
    );
  }

  getApplicationsWithFilter(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/applicationListwithfilters`,
      data
    );
  }
  getmonthandyear(): Observable<any> {
    return this.http.get(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/ApplicationMonthYears`
    );
  }
  getCategories(): Observable<any> {
    return this.http.get(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/ApplicationCategories`
    );
  }
  getApplication(id: any): Observable<any> {
    return this.http.get(`http://localhost:5550/api/products/find/` + id);
  }

  getPDF(data: any): Observable<any> {
    return this.http.post(
      'https://uatapis.edelweissalternatives.com/swiftapi/api/v1/esign/DownloadDigioPDF',
      data
    );
  }

  getPDFFile(data: any): Observable<any> {
    return this.http.post(
      'https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/GetKycDoc',
      data
    );
  }

  submit(data: any) {
    return this.http.post(
      'https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/UpdateApplicationStatusCams',
      data
    );
  }

  //after logs and esign
  logs(data: any): Observable<any> {
    return this.http.post(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/cams/saveCamsActivityLog`,
      data
    );
  }
  getEsignPDF(investmentID: any): Observable<any> {
    return this.http.get(
      `https://uatapis.edelweissalternatives.com/swiftapi/api/v1/esign/downloadAfterSigning/${investmentID}/ApplicationPDF`
    );
  }
}
