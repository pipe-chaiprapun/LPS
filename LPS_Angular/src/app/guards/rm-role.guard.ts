import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad, Route, UrlSegment,
  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';
import { AppUrl } from '../app.url';
import { RoleType } from '../models/User/UserRoleModel';
import { ErrorService } from '../services/error.service';
import { AuthUrl } from '../authentication/authentication.url';

@Injectable({
  providedIn: 'root'
})
export class RmRoleGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authService: AuthorizationService, private errorService: ErrorService) { }
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentRoleOrg = this.authService.getUserRoleOrg;
    if (currentRoleOrg) {
      const department = this.authService.getUserDepartment(currentRoleOrg);
      const roleType = this.authService.getUserRoleType(department.ROLE_CODE);
      if (roleType === RoleType.Rm) {
        return true;
      } else if (roleType === RoleType.Security) {
        this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.UserSetting}`]);
        return false;
      }
    }
    this.router.navigate([`/${this.AppUrl.Login}`]);
    return false;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
