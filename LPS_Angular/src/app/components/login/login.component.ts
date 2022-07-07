import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { AppUrl } from 'src/app/app.url';
import { AuthUrl } from 'src/app/authentication/authentication.url';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { NotifyService, Icon, Type } from 'src/app/services/notify.service';
import Swal from 'sweetalert2';
import { UserRoleModel, RoleType } from 'src/app/models/User/UserRoleModel';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { UserAccountService } from 'src/app/services/user-account.service';
import { ReportModel } from 'src/app/models/Report/ReportModel';
import { ReportService } from 'src/app/services/report.service';
declare const $;
declare const App;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;
  currentUser: CurrentSessionModel;
  roles: UserRoleModel[];
  rmRole = ['L1000', 'L2000', 'L3000', 'L4000', 'L5000', 'L6000', 'L7000'];

  constructor(private router: Router, private auth: AuthorizationService,
    private errorService: ErrorService, private notify: NotifyService,
    private userService: UserAccountService, private reportService: ReportService) { }

  ngOnInit() {
    App.initLoadPage();
    this.auth.GetMasterData().subscribe(data => {
      if (data) {
        this.auth.setMasterData(data);
      }
    });
  }

  login(username, password) {
    const loginData = {
      username: username.value,
      password: password.value
    };
    const encodeBasic = btoa(`${loginData.username}:${loginData.password}`);
    // console.log(encodeBasic);

    Swal.fire({
      titleText: 'Authorization',
      text: 'Verifying your account',
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.auth.Login(encodeBasic).subscribe(data => {
          // this.auth.setUserProfile(data);
          this.currentUser = data;
          if (data.user.roles.length > 0) {
            Swal.fire({
              title: 'Welcome!',
              text: `${data.user.name}`,
              icon: 'success',
              showConfirmButton: false,
              // showCloseButton: false,
              timer: 1500
            }).then((result) => {
              if (data.user.roles.length > 1) {
                this.roles = data.user.roles;
                $('#selectRoleModal').modal({ backdrop: 'static', keyboard: false, show: true });
              } else if (data.user.roles.length === 1) {
                this.userService.getRoleOrg(data.user.roles[0].ROLE_CODE, data.user.username).subscribe(roleOrg => {
                  this.currentUser.currentRole = data.user.roles[0];
                  this.auth.setUserProfile(this.currentUser);
                  this.auth.setUserRoleOrg(roleOrg);
                  const department = this.auth.getUserDepartment(roleOrg);
                  if (this.auth.getUserRoleType(department.ROLE_CODE) === RoleType.Rm) {
                    this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Dashboard}`]);
                  } else if (this.auth.getUserRoleType(department.ROLE_CODE) === RoleType.Security) {
                    this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Setting}/usersetting`]);
                  } else {
                    this.errorService.onRequestError('SIGN IN', { status: 401, error: 'Your role is unauthorized!' });
                  }
                }, error => {
                  this.errorService.onRequestError('Get role org', error);
                });
              } else {
                this.errorService.onRequestError('SIGN IN', { status: 401, error: 'Your role is unauthorized!' });
              }
            });
          } else {
            this.errorService.onRequestError('SIGN IN', { status: 401, error: 'Your role is unauthorized!' });
          }
        }, error => {
          console.log(error.statusText);
          this.errorService.onRequestError('SIGN IN', error);
        });
      }
    });
  }

  selectRole(role) {
    this.userService.getRoleOrg(role.ROLE_CODE, '0').subscribe(roleOrg => {
      this.currentUser.currentRole = role;
      this.auth.setUserProfile(this.currentUser);
      this.auth.setUserRoleOrg(roleOrg);
      // const department = roleOrg.department[0].ROLE_CODE;
      const department = this.auth.getUserDepartment(roleOrg);
      $('#selectRoleModal').modal('hide');
      if (this.auth.getUserRoleType(department.ROLE_CODE) === RoleType.Rm) {
        this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Dashboard}`]);
      } else if (this.auth.getUserRoleType(department.ROLE_CODE) === RoleType.Security) {
        this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Setting}/usersetting`]);
      } else {
        this.errorService.onRequestError('SIGN IN', { status: 401, error: 'Your role is unauthorized!' });
      }
    }, error => {
      this.errorService.onRequestError('Get role org', error);
    });
  }
}
