import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConfirmOtpComponent } from './confirm-otp/confirm-otp.component';
import { SignupOtpComponent } from './signup-otp/signup-otp.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyApplicationComponent } from './verify-application/verify-application.component';
import { AuthGuard } from './auth.guard';
import { UpdateComponent } from './update/update.component';
import { UpdateOtpComponent } from './update-otp/update-otp.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path: 'forget',
  //   children: [
  //     { path: '', component: ForgetPasswordComponent },
  //     { path: ':token', component: ForgetPasswordComponent }
  //   ]
  // },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'update',
    component: UpdateComponent,
  },
  {
    path: 'update-otp',
    component: UpdateOtpComponent,
  },
  {
    path: 'confirm-otp',
    component: ConfirmOtpComponent,
  },
  {
    path: 'signup-otp',
    component: SignupOtpComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardPageComponent,
  },
  {
    path: 'verify-application/:id',
    canActivate: [AuthGuard],
    component: VerifyApplicationComponent,
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
