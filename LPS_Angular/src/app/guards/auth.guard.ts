import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad, Route, UrlSegment,
  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppUrl } from '../app.url';
import { AuthorizationService } from '../services/authorization.service';
import { CurrentSessionModel } from '../models/User/CurrentSessionModel';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  AppUrl = AppUrl;
  constructor(private router: Router, private authService: AuthorizationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentSession: CurrentSessionModel = this.authService.getUserProfile;
    if (currentSession && currentSession.accessToken) {
      // if (state.url === '/authentication/usersetting' && currentSession.user.role !== 3) {
      //   console.log('This session is not allow for this route!');
      //   this.router.navigate([`/${this.AppUrl.Login}`], { queryParams: { returnUrl: state.url } });
      //   return false;
      // }
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate([`/${this.AppUrl.Login}`]);
    // this.router.navigate([`/${this.AppUrl.Login}`], { queryParams: { returnUrl: state.url } });
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
