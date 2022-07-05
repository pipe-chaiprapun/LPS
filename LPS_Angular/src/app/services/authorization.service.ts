import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { host } from '../constant/http-service';
import { CurrentSessionModel } from '../models/User/CurrentSessionModel';
import { GetRoleOrgModel, RoleOrgModel, RoleType } from '../models/User/UserRoleModel';
import { environment } from '../../environments/environment';
import { MasterDataModel } from '../models/User/ParameterModel';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private baseUrl = environment.apiHost;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private loginUrl = `${this.baseUrl}/api/authorization/login`;  //production
  // private loginUrl = `${this.baseUrl}/api/authorization/login2`; //uat
  private masterDataUrl = `${this.baseUrl}/api/authorization/masterdata`;

  constructor(private http: HttpClient) { }

  Login(encodeUserPass): Observable<CurrentSessionModel> {
    return this.http.post<CurrentSessionModel>(this.loginUrl, { action: 'Login' }, { headers: new HttpHeaders({ Authorization: `Basic ${encodeUserPass}` }) });
  }
  GetMasterData(): Observable<MasterDataModel[]> {
    return this.http.get<MasterDataModel[]>(this.masterDataUrl, { headers: this.headers });
  }
  Logout() {
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentRoleOrg');
  }

  setUserProfile(data) {
    localStorage.setItem('currentSession', JSON.stringify(data));
  }

  setMasterData(data) {
    localStorage.setItem('masterData', JSON.stringify(data));
  }

  get getUserProfile(): CurrentSessionModel {
    return JSON.parse(localStorage.getItem('currentSession'));
  }

  get getMasterData(): MasterDataModel[] {
    return JSON.parse(localStorage.getItem('masterData'));
  }

  setUserRoleOrg(data) {
    localStorage.setItem('currentRoleOrg', JSON.stringify(data));
  }

  get getUserRoleOrg(): GetRoleOrgModel {
    return JSON.parse(localStorage.getItem('currentRoleOrg'));
  }

  getUserDepartment(data: GetRoleOrgModel): RoleOrgModel {
    return data.department[0];
  }
  get getCurrentUserDepartment(): RoleOrgModel {
    return this.getUserRoleOrg.department[0];
  }

  getUserRoleType(department): RoleType {
    // if (department === 'L1000' || department === 'L2000' || department === 'L3000' || department === 'L4000' ||
    //   department === 'L5000' || department === 'L6000' || department === 'L7000') {
    //   return RoleType.Rm;
    // } else if (department === 'S1000') {
    //   return RoleType.Security;
    // } else {
    //   return null;
    // }
    if (department === 'S1000') {
      return RoleType.Security;
    } else {
      return RoleType.Rm;
    }
  }

  get getHeader(): HttpHeaders {
    const currentSession: CurrentSessionModel = this.getUserProfile;
    if (currentSession && currentSession.accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentSession.accessToken}`
      });
    }
  }
}
