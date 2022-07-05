import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductGroupModel } from '../models/Account/ProductGroupModel';
import { GetLoanAccountModel } from '../models/Account/LoanAccountModel';
import { GetDepositAccountModel } from '../models/Account/DepositAccountModel';
// import { host } from '../constant/http-service';
import { environment } from '../../environments/environment';
import { AuthorizationService } from './authorization.service';
import { GetLoanLimitModel, LoanLimitDetailModel } from '../models/Account/LoanLimitModel';
import { CollateralModel, CollateralDetailModel } from '../models/Account/CollateralModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = environment.apiHost;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private productGroupUrl = `${this.baseUrl}/api/account/productGroup`;
  private loanlimitUrl = `${this.baseUrl}/api/account/loanlimit`;
  private loanLimitDetailUrl = `${this.baseUrl}/api/account/loanlimit/detail`;
  private loanUrl = `${this.baseUrl}/api/account/loan`;
  private depositUrl = `${this.baseUrl}/api/account/deposit`;
  private relationUrl = `${this.baseUrl}/api/account/relation`;
  private serviceUrl = `${this.baseUrl}/api/account/service`;
  private accCollateralUrl = `${this.baseUrl}/api/account/collateral`;
  private accCollateralDetailurl = `${this.baseUrl}/api/account/collateral/detail`;

  constructor(private http: HttpClient, private authService: AuthorizationService) { }

  getProductGroup(cif): Observable<ProductGroupModel> {
    return this.http.get<ProductGroupModel>(`${this.productGroupUrl}?cif=${cif}`, { headers: this.authService.getHeader });
  }

  // getLoanAccounts(): Observable<LoanAccountModel> {
  //   return this.http.get<LoanAccountModel>(this.loanUrl, { headers: this.getHeaders() });
  // }
  getLoanLimits(filter): Observable<GetLoanLimitModel> {
    return this.http.post<GetLoanLimitModel>(this.loanlimitUrl, filter, { headers: this.authService.getHeader });
  }
  getLoanLitmitDetail(cif): Observable<LoanLimitDetailModel[]> {
    return this.http.get<LoanLimitDetailModel[]>(`${this.loanLimitDetailUrl}?cif_no=${cif}`, { headers: this.authService.getHeader });
  }

  getLoanAccounts(filter): Observable<GetLoanAccountModel> {
    return this.http.post<GetLoanAccountModel>(this.loanUrl, filter, { headers: this.authService.getHeader });
  }

  getAccCollateral(account_no): Observable<CollateralModel[]> {
    return this.http.get<CollateralModel[]>(`${this.accCollateralUrl}?account_no=${account_no}`, { headers: this.authService.getHeader });
  }
  getAccCollateral2(filter): Observable<CollateralModel[]> {
    return this.http.post<CollateralModel[]>(this.accCollateralUrl, filter, { headers: this.authService.getHeader });
  }
  getAccCollateralDetail(id): Observable<CollateralDetailModel[]> {
    return this.http.get<CollateralDetailModel[]>(`${this.accCollateralDetailurl}?id=${id}`, { headers: this.authService.getHeader });
  }

  getDepositAccounts(filter): Observable<GetDepositAccountModel> {
    return this.http.post<GetDepositAccountModel>(this.depositUrl, filter, { headers: this.authService.getHeader });
  }

  getLoanAccountRelation(accountNo) {
    return this.http.get(`${this.relationUrl}?account=${accountNo}`, { headers: this.authService.getHeader });
  }

  getDepositAccountRelation(accountNo) {
    return this.http.get(`${this.relationUrl}?account=${accountNo}`, { headers: this.authService.getHeader });
  }

  getAccServices(cif) {
    return this.http.get(`${this.serviceUrl}?cif=${cif}`, { headers: this.authService.getHeader });
  }
}
