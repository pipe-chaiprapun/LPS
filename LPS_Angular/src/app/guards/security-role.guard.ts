import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';
import { AppUrl } from '../app.url';
import { RoleType } from '../models/User/UserRoleModel';
import { AuthUrl } from '../authentication/authentication.url';

@Injectable({
  providedIn: 'root'
})
export class SecurityRoleGuard implements CanActivate {
  constructor(private authService: AuthorizationService, private router: Router) { }
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentRoleOrg = this.authService.getUserRoleOrg;
    if (currentRoleOrg) {
      const currentDepartment = this.authService.getUserDepartment(currentRoleOrg);
      const roleType = this.authService.getUserRoleType(currentDepartment.ROLE_CODE);
      if (roleType === RoleType.Security) {
        return true;
      } else if (roleType === RoleType.Rm) {
        this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Dashboard}`]);
        return false;
      }
    }

    this.router.navigate([`/${this.AppUrl.Login}`]);
    return false;
  }

}
