import { Component, OnInit } from '@angular/core';
import { AuthUrl } from 'src/app/authentication/authentication.url';
import { AppUrl } from 'src/app/app.url';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserModel } from 'src/app/models/UserModel';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { ErrorService } from 'src/app/services/error.service';
import { RoleType } from 'src/app/models/User/UserRoleModel';
import { ReportService } from 'src/app/services/report.service';
import { ReportModel } from 'src/app/models/Report/ReportModel';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
declare const App;

@Component({
  selector: 'app-auth-sidebar',
  templateUrl: './auth-sidebar.component.html',
  styleUrls: ['./auth-sidebar.component.scss']
})
export class AuthSidebarComponent implements OnInit {
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;
  currentSession: CurrentSessionModel;
  userProfile: UserModel;
  roleType: RoleType;
  reportList: ReportModel[];
  constructor(private authService: AuthorizationService, private reportService: ReportService, private errorService: ErrorService) {
    this.reportService.reportList.subscribe(data => {
      this.reportList = data;
    });
  }

  ngOnInit() {
    App.initLoadPage();
    console.log('init load page');
    this.currentSession = this.authService.getUserProfile;
    const department = this.authService.getCurrentUserDepartment;
    if (this.currentSession != null) {
      this.userProfile = this.currentSession.user;
    }
    this.roleType = this.authService.getUserRoleType(department.ROLE_CODE);
    // this.reportList = this.reportService.reportList2;
    // console.log(this.reportList);

    // this.reportService.getReportLst(this.currentSession.currentRole.ROLE_CODE).subscribe(data => {
    //   this.reportList = data;
    //   this.reportService.setReportList(data);
    // }, error => {
    //   this.errorService.onRequestError('Get report list', error);
    // });
  }
}
