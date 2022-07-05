import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { GetUsersModel, UserAccountModel } from '../models/UserAccountModel';
import { EmpUnitModel } from '../models/EmpUnitModel';
import { AuthorizationService } from './authorization.service';
import { UserRoleModel, RoleOrgModel, GetRoleOrgModel } from '../models/User/UserRoleModel';
import { GetRmModel, RmModel } from '../models/User/RmModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  constructor(private http: HttpClient, private authService: AuthorizationService) { }

  private currentUser = new Subject<UserAccountModel>();
  private currentRm = new Subject<RmModel>();

  private baseUrl = environment.apiHost;

  private usersUrl = `${this.baseUrl}/api/user/users`;
  private getRmsUrls = `${this.baseUrl}/api/user/users2`;
  private setRmsRoleUrl = `${this.baseUrl}/api/user/setrole`;
  private deleteRmsRoleUrl = `${this.baseUrl}/api/user/deleterole`;
  private setRmStatusUrl = `${this.baseUrl}/api/user/setstatus`;
  private getRmStatusUrl = `${this.baseUrl}/api/user/getstatus`;
  private userUrl = `${this.baseUrl}/api/user/id`;
  private unitsUrl = `${this.baseUrl}/api/user/units`;
  private roleUrl = `${this.baseUrl}/api/user/roles`;
  private roleOrgUrl = `${this.baseUrl}/api/user/roles/org`;
  private roleFilter = `${this.baseUrl}/api/user/filter`;
  // private customerFilterUrl = `${this.baseUrl}/api/customer/customers/filter`;
  // private customerInfoUrl = `${this.baseUrl}/api/customer/info`;

  getUsers(filter): Observable<GetUsersModel> {
    return this.http.post<GetUsersModel>(this.usersUrl, filter, { headers: this.authService.getHeader });
  }
  getRm(filter): Observable<GetRmModel> {
    return this.http.post<GetRmModel>(this.getRmsUrls, filter, { headers: this.authService.getHeader });
  }
  setRmRole(staff_no, role_code, create_by): Observable<number> {
    return this.http.get<number>(`${this.setRmsRoleUrl}?staff_no=${staff_no}&role_code=${role_code}&create_by=${create_by}`,
      { headers: this.authService.getHeader });
  }
  deleteRmRole(staff_no, role_code, create_by): Observable<number> {
    return this.http.delete<number>(`${this.deleteRmsRoleUrl}?staff_no=${staff_no}&role_code=${role_code}&create_by=${create_by}`,
      { headers: this.authService.getHeader });
  }
  setRmStatus(staff_no, flag, update_by): Observable<number> {
    return this.http.get<number>(`${this.setRmStatusUrl}?staff_no=${staff_no}&flag=${flag}&update_by=${update_by}`,
      { headers: this.authService.getHeader });
  }
  getRmStatus(staff_no): Observable<string> {
    return this.http.get<string>(`${this.getRmStatusUrl}?staff_no=${staff_no}`, { headers: this.authService.getHeader });
  }

  getUnits(): Observable<EmpUnitModel[]> {
    return this.http.get<EmpUnitModel[]>(this.unitsUrl, { headers: this.authService.getHeader });
  }

  getUser(id: string): Observable<UserAccountModel> {
    return this.http.get<UserAccountModel>(`${this.userUrl}?id=${id}`, { headers: this.authService.getHeader });
  }

  getRoles(id): Observable<UserRoleModel[]> {
    return this.http.get<UserRoleModel[]>(`${this.roleUrl}?employee_id=${id}`, { headers: this.authService.getHeader });
  }

  getRoleOrg(code, staff_no): Observable<GetRoleOrgModel> {
    return this.http.get<GetRoleOrgModel>(`${this.roleOrgUrl}?role_code=${code}&staff_no=${staff_no}`,
      { headers: this.authService.getHeader });
  }

  getRoleFilter(level, parent): Observable<RoleOrgModel[]> {
    return this.http.get<RoleOrgModel[]>(`${this.roleFilter}?level=${level}&parent=${parent}`,
      { headers: this.authService.getHeader });
  }

  saveCurrentRm(rm: RmModel) {
    this.currentRm.next(rm);
  }
  viewCurrentRm(): Observable<RmModel> {
    return this.currentRm.asObservable();
  }
  clearCurrentRm() {
    this.currentRm.next();
  }


  saveUserInfo(user: UserAccountModel) {
    this.currentUser.next(user);
  }
  viewUserInfo(): Observable<UserAccountModel> {
    return this.currentUser.asObservable();
  }
  clearUserInfo() {
    this.currentUser.next();
  }

  // private getHeaders() {
  //   const currentSession: CurrentSessionModel = this.authService.getUserProfile;
  //   if (currentSession && currentSession.accessToken) {
  //     return new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${currentSession.accessToken}`
  //     });
  //   }
  // }

  // private getCurrentSession() {
  //   return JSON.parse(localStorage.getItem('currentSession'));
  // }
}

