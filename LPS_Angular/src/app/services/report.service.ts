import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from './authorization.service';
import { Observable, Subject } from 'rxjs';
import { OdStatementModel, OdAccount } from '../models/Report/OdStatementModel';
import { ReportModel } from '../models/Report/ReportModel';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  private baseUrl = environment.apiHost;
  private lstReportUrl = `${this.baseUrl}/api/report/list`;
  private checkAuthreportUrl = `${this.baseUrl}/api/report/checkauth`;
  private odStatementUrl = `${this.baseUrl}/api/report/od/statement`;
  private odAccUrl = `${this.baseUrl}/api/report/od/account`;
  private odDownload = `${this.baseUrl}/api/report/od/download`;

  private reportList$ = new Subject<ReportModel[]>();

  reportList = this.reportList$.asObservable();

  constructor(private http: HttpClient, private authService: AuthorizationService) { }

  getReportLst(roleCode, staffNo): Observable<ReportModel[]> {
    return this.http.get<ReportModel[]>(`${this.lstReportUrl}?role_code=${roleCode}&staff_no=${staffNo}`,
      { headers: this.authService.getHeader });
  }
  getReportAuth(reportCode, roleCode, staffNo): Observable<any> {
    return this.http.get<any>(`${this.checkAuthreportUrl}?report_id=${reportCode}&role_code=${roleCode}&staff_no=${staffNo}`,
      { headers: this.authService.getHeader });
  }
  setReportList(reports) {
    // this.reportList = reports;
    this.reportList$.next(reports);
  }
  getOdStatement(date, account): Observable<OdStatementModel[]> {
    return this.http.get<OdStatementModel[]>(`${this.odStatementUrl}?date=${date}&account=${account}`, { headers: this.authService.getHeader });
  }
  getOdAccount(name, dept): Observable<OdAccount[]> {
    return this.http.get<OdAccount[]>(`${this.odAccUrl}?name=${name}&dept=${dept}`, { headers: this.authService.getHeader });
  }
  downloadOdAccount(account, date): Observable<Blob> {
    return this.http.get(`${this.odDownload}?account=${account}&date=${date}`, { headers: this.authService.getHeader, responseType: 'blob' });
  }
}
