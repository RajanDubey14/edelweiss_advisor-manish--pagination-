import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmOtpComponent } from './confirm-otp/confirm-otp.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { VerifyApplicationComponent } from './verify-application/verify-application.component';
import { HeaderComponent } from './header/header.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SignupOtpComponent } from './signup-otp/signup-otp.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SpinnerComponent } from './spinner/spinner.component';
import { PledgeComponent } from './pledge/pledge.component';
import { UnpledgeComponent } from './unpledge/unpledge.component';
import { KycdocumentComponent } from './kycdocument/kycdocument.component';
import { UpdateComponent } from './update/update.component';
import { UpdateOtpComponent } from './update-otp/update-otp.component';
import { DatashareService } from './datashare.service';
import { CustomnumberPipe } from './customnumber.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ConfirmOtpComponent,
    DashboardPageComponent,
    VerifyApplicationComponent,
    HeaderComponent,
    SignupOtpComponent,
    SpinnerComponent,
    PledgeComponent,
    UnpledgeComponent,
    KycdocumentComponent,
    UpdateComponent,
    UpdateOtpComponent,
    CustomnumberPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PdfViewerModule,
    ModalModule.forRoot(),
    HttpClientModule,
    Ng2SearchPipeModule,
    NoopAnimationsModule,
    NgxImageZoomModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    DatashareService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
