import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { host } from '../constant/http-service';
import { TodoModel, TodoDetailModel, NotificationModel } from '../models/Dashboard/TodoModel';
import { AuthorizationService } from './authorization.service';
import { GetKpiModel } from '../models/Dashboard/GetKpiModel';
import { SummaryModel } from '../models/Dashboard/SummaryModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiHost;

  private kpiUrl = `${this.baseUrl}/api/dashboard/kpi`;
  private todoUrl = `${this.baseUrl}/api/dashboard/todo`;
  private todoNotiUrl = `${this.baseUrl}/api/dashboard/todo/notification`;
  private todoDetailUrl = `${this.baseUrl}/api/dashboard/todo/detail`;
  private summaryUrl = `${this.baseUrl}/api/dashboard/summary`;

  constructor(private http: HttpClient, private authService: AuthorizationService) { }

  getKPI(role_code): Observable<GetKpiModel> {
    return this.http.get<GetKpiModel>(`${this.kpiUrl}?role_code=${role_code}`, { headers: this.authService.getHeader });
  }

  getTodo(department, sub_department, unit, staff_no): Observable<TodoModel[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<TodoModel[]>(`${this.todoUrl}?department=${department}&sub_department=${sub_department}&unit=${unit}&staff_no=${staff_no}`,
      { headers: this.authService.getHeader });
  }

  getTodoNoti(department, sub_department, unit, staff_no): Observable<NotificationModel> {
    return this.http.get<NotificationModel>(`${this.todoNotiUrl}?department=${department}&sub_department=${sub_department}&unit=${unit}&staff_no=${staff_no}`,
      { headers: this.authService.getHeader });
  }
  getTodoDetail(department, sub_department, unit, staff_no, topic): Observable<TodoDetailModel[]> {
    return this.http.get<TodoDetailModel[]>(`${this.todoDetailUrl}?department=${department}&sub_department=${sub_department}&unit=${unit}&topic=${topic}&staff_no=${staff_no}`,
      { headers: this.authService.getHeader });
  }

  getSummary(department, sub_department, unit, staff_no): Observable<SummaryModel[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<SummaryModel[]>(`${this.summaryUrl}?department=${department}&sub_department=${sub_department}&unit=${unit}&staff_no=${staff_no}`, { headers: this.authService.getHeader });
  }

  // get getHeaders(): HttpHeaders {
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
