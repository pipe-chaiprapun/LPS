import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerOptionModel } from '../models/Customer/CustomerOptionModel';
import { Observable, BehaviorSubject } from 'rxjs';
import { GetCustomerModel, CustomerModel } from '../models/Customer/CustomerModel';
import { CustomerGroup, CustomerInfoModel } from '../models/Customer/CustomerInfoModel';
// import { host } from '../constant/http-service';
import { AuthorizationService } from './authorization.service';
import { GetCustomerProfileModel } from '../models/Customer/CustomerProfileModel';
import { environment } from '../../environments/environment';
import { CollateralModel, CollateralDetailModel } from '../models/Account/CollateralModel';
import { CustomerGroupsModel } from '../models/Customer/CustomerGroupsModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = environment.apiHost;
  // private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private customerUrl = `${this.baseUrl}/api/customer/customers`;
  private downloadCustomerUrl = `${this.baseUrl}/api/customer/download`;
  private customerFilterUrl = `${this.baseUrl}/api/customer/customers/filter`;
  private customerInfoUrl = `${this.baseUrl}/api/customer/info`;
  private customerProfileUrl = `${this.baseUrl}/api/customer/profile`;
  private customerCollateralUrl = `${this.baseUrl}/api/customer/collateral`;
  private customerCollateralDetailUrl = `${this.baseUrl}/api/customer/collateral/detail`;
  private listCustomerGroupsUrl = `${this.baseUrl}/api/customer/groups`;
  private customerGroupDetailUrl = `${this.baseUrl}/api/customer/group/detail`;

  private _currentCif = new BehaviorSubject('');
  private _currentCustomerName = new BehaviorSubject('');
  currentCif = this._currentCif.asObservable();
  currentCustomerName = this._currentCustomerName.asObservable();
  setCurrentCif(cif) { this._currentCif.next(cif); }
  setCurrentCustomerName(name) { this._currentCustomerName.next(name); }

  constructor(private http: HttpClient, private authService: AuthorizationService) { }

  getCustomerGroups(filter): Observable<CustomerGroupsModel[]> {
    return this.http.post<CustomerGroupsModel[]>(this.listCustomerGroupsUrl, filter, { headers: this.authService.getHeader });
  }
  getCustomer(filter): Observable<GetCustomerModel> {
    return this.http.post<GetCustomerModel>(this.customerUrl, filter, { headers: this.authService.getHeader });
  }
  getCustomerCollateral2(filter): Observable<CollateralModel[]> {
    return this.http.post<CollateralModel[]>(this.customerCollateralUrl, filter, { headers: this.authService.getHeader });
  }

  downloadCustomer(filter): Observable<CustomerModel[]> {
    return this.http.post<CustomerModel[]>(this.downloadCustomerUrl, filter, { headers: this.authService.getHeader });
  }

  getCustomerFilterOptions(): Observable<CustomerOptionModel> {
    return this.http.get<CustomerOptionModel>(this.customerFilterUrl, { headers: this.authService.getHeader });
  }

  getCustomerInfo(cif, dept, sub_dept, unit, staff_no): Observable<CustomerInfoModel> {
    return this.http.get<CustomerInfoModel>(`${this.customerInfoUrl}?cif=${cif}&dept=${dept}&sub_dept=${sub_dept}&unit=${unit}&staff_no=${staff_no}`,
      { headers: this.authService.getHeader });
  }

  getCustomerGroupDetail(cif): Observable<CustomerGroup[]> {
    return this.http.get<CustomerGroup[]>(`${this.customerGroupDetailUrl}?cif=${cif}`,
      { headers: this.authService.getHeader });
  }

  getCustomerInfo2(cif): Observable<CustomerInfoModel> {
    return this.http.get<CustomerInfoModel>(`${this.customerInfoUrl}?cif=${cif}`,
      { headers: this.authService.getHeader });
  }

  getCustomerProfile(cif): Observable<GetCustomerProfileModel> {
    return this.http.get<GetCustomerProfileModel>(`${this.customerProfileUrl}?cif=${cif}`, { headers: this.authService.getHeader });
  }

  getCustomerCollateral(cif): Observable<CollateralModel[]> {
    return this.http.get<CollateralModel[]>(`${this.customerCollateralUrl}?cif=${cif}`, { headers: this.authService.getHeader });
  }
  getCustomerCollateralDetail(id): Observable<CollateralDetailModel[]> {
    return this.http.get<CollateralDetailModel[]>(`${this.customerCollateralDetailUrl}?id=${id}`, { headers: this.authService.getHeader });
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
