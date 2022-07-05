import { Component, OnInit } from '@angular/core';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { SummaryModel } from 'src/app/models/Dashboard/SummaryModel';
import { ErrorService } from 'src/app/services/error.service';
import { UserAccountService } from 'src/app/services/user-account.service';
import { RoleOrgModel } from 'src/app/models/User/UserRoleModel';
import { formatDate } from '@angular/common';
// import * as XLSX from 'xlsx';
import { RmFilterModel } from 'src/app/models/User/RmModel';
declare const $;

@Component({
  selector: 'app-summary-port',
  templateUrl: './summary-port.component.html',
  styleUrls: ['./summary-port.component.scss']
})
export class SummaryPortComponent implements OnInit {

  currentSession: CurrentSessionModel;
  summary: SummaryModel[] = [];
  expand = false;
  department: RoleOrgModel[] = [];
  subDepartment: RoleOrgModel[] = [];
  unitLeader: RoleOrgModel[] = [];
  unit: RoleOrgModel[] = [];

  totalInitLimit = 0;
  totalInitCbal = 0;
  totalTarget = 0;
  totalCurrentLimit = 0;
  totalCurrentCbal = 0;
  totalDiffTarget = 0;
  totalDiffInitLitmit = 0;
  totalDiffInitCbal = 0;
  totalAvgOutstanding = 0;

  constructor(private dashboardService: DashboardService,
    private authService: AuthorizationService,
    private errorService: ErrorService,
    private userService: UserAccountService) { }

  ngOnInit() {

  }
  getSummary() {
    console.log('get summary');
    this.currentSession = this.authService.getUserProfile;

    this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
      this.department = data.department;
      this.subDepartment = data.subDepartment;
      this.unitLeader = data.unitLeader;
      this.unit = data.unit;

      const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
      const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;

      // case user is level 1
      // if (this.department.length > 0 &&
      //   this.department.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
      if (currentRoleLevel === 1 || isGroupLevel) {
        this.dashboardService.getSummary(this.currentSession.currentRole.ROLE_CODE, '', '', '').subscribe(summary => {
          this.summary = summary;
          if (summary.length > 0) {
            this.totalInitLimit = 0;
            this.totalInitCbal = 0;
            this.totalTarget = 0;
            this.totalCurrentLimit = 0;
            this.totalCurrentCbal = 0;
            this.totalDiffTarget = 0;
            this.totalDiffInitLitmit = 0;
            this.totalDiffInitCbal = 0;
            this.totalAvgOutstanding = 0;
            this.summary.forEach(s => {
              s.INIT_ASDATE = formatDate(this.convertDate(s.INIT_ASDATE), 'MMM yyyy', 'en-US');
              s.CURRENT_ASDATE = formatDate(this.convertDate(s.CURRENT_ASDATE), 'dd MMM yyyy', 'en-US');
              s.VARIANCE_DATE = formatDate(this.convertDate(s.VARIANCE_DATE), 'MMM yyyy', 'en-US');
              this.totalInitLimit += s.INIT_TOTAL_LIMIT;
              this.totalInitCbal += s.INIT_TOTAL_CBAL;
              this.totalTarget += s.TOTAL_TARGET;
              this.totalCurrentLimit += s.CURRENT_TOTAL_LIMIT;
              this.totalCurrentCbal += s.CURRENT_TOTAL_CBAL;
              this.totalDiffTarget += s.DIFF_TARGET;
              this.totalDiffInitLitmit += s.DIFF_INIT_LIMIT;
              this.totalDiffInitCbal += s.DIFF_INIT_CBAL;
              this.totalAvgOutstanding += s.AVG_OUTSTANDING;
            });
          }
        }, error => this.errorService.onRequestError('Get Summary Port', error));

      } else if (currentRoleLevel === 2) {
        // else if (this.subDepartment.length > 0 && // case user is level 2
        //   this.subDepartment.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
        this.dashboardService.getSummary('', this.currentSession.currentRole.ROLE_CODE, '', '').subscribe(summary => {
          this.summary = summary;
          if (summary.length > 0) {
            this.totalInitLimit = 0;
            this.totalInitCbal = 0;
            this.totalTarget = 0;
            this.totalCurrentLimit = 0;
            this.totalCurrentCbal = 0;
            this.totalDiffTarget = 0;
            this.totalDiffInitLitmit = 0;
            this.totalDiffInitCbal = 0;
            this.totalAvgOutstanding = 0;
            this.summary.forEach(s => {
              s.INIT_ASDATE = formatDate(this.convertDate(s.INIT_ASDATE), 'MMM yyyy', 'en-US');
              s.CURRENT_ASDATE = formatDate(this.convertDate(s.CURRENT_ASDATE), 'dd MMM yyyy', 'en-US');
              s.VARIANCE_DATE = formatDate(this.convertDate(s.VARIANCE_DATE), 'MMM yyyy', 'en-US');
              this.totalInitLimit += s.INIT_TOTAL_LIMIT;
              this.totalInitCbal += s.INIT_TOTAL_CBAL;
              this.totalTarget += s.TOTAL_TARGET;
              this.totalCurrentLimit += s.CURRENT_TOTAL_LIMIT;
              this.totalCurrentCbal += s.CURRENT_TOTAL_CBAL;
              this.totalDiffTarget += s.DIFF_TARGET;
              this.totalDiffInitLitmit += s.DIFF_INIT_LIMIT;
              this.totalDiffInitCbal += s.DIFF_INIT_CBAL;
              this.totalAvgOutstanding += s.AVG_OUTSTANDING;
            });
          }
        }, error => this.errorService.onRequestError('Get Summary Port', error));
      } else if (currentRoleLevel === 3) {
        // else if (this.unitLeader.length > 0 && // case user is level 3
        //   this.unitLeader.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
        this.dashboardService.getSummary('', '', this.currentSession.currentRole.ROLE_CODE, '').subscribe(summary => {
          this.summary = summary;
          if (summary.length > 0) {
            this.totalInitLimit = 0;
            this.totalInitCbal = 0;
            this.totalTarget = 0;
            this.totalCurrentLimit = 0;
            this.totalCurrentCbal = 0;
            this.totalDiffTarget = 0;
            this.totalDiffInitLitmit = 0;
            this.totalDiffInitCbal = 0;
            this.totalAvgOutstanding = 0;
            this.summary.forEach(s => {
              s.INIT_ASDATE = formatDate(this.convertDate(s.INIT_ASDATE), 'MMM yyyy', 'en-US');
              s.CURRENT_ASDATE = formatDate(this.convertDate(s.CURRENT_ASDATE), 'dd MMM yyyy', 'en-US');
              s.VARIANCE_DATE = formatDate(this.convertDate(s.VARIANCE_DATE), 'MMM yyyy', 'en-US');
              this.totalInitLimit += s.INIT_TOTAL_LIMIT;
              this.totalInitCbal += s.INIT_TOTAL_CBAL;
              this.totalTarget += s.TOTAL_TARGET;
              this.totalCurrentLimit += s.CURRENT_TOTAL_LIMIT;
              this.totalCurrentCbal += s.CURRENT_TOTAL_CBAL;
              this.totalDiffTarget += s.DIFF_TARGET;
              this.totalDiffInitLitmit += s.DIFF_INIT_LIMIT;
              this.totalDiffInitCbal += s.DIFF_INIT_CBAL;
              this.totalAvgOutstanding += s.AVG_OUTSTANDING;
            });
          }
        }, error => this.errorService.onRequestError('Get Summary Port', error));
      } else { // case user is level 4
        this.dashboardService.getSummary('', '', this.unitLeader[0].ROLE_CODE, this.currentSession.user.username).subscribe(summary => {
          this.summary = summary;
          if (summary.length > 0) {
            this.totalInitLimit = 0;
            this.totalInitCbal = 0;
            this.totalTarget = 0;
            this.totalCurrentLimit = 0;
            this.totalCurrentCbal = 0;
            this.totalDiffTarget = 0;
            this.totalDiffInitLitmit = 0;
            this.totalDiffInitCbal = 0;
            this.totalAvgOutstanding = 0;
            this.summary.forEach(s => {
              s.INIT_ASDATE = formatDate(this.convertDate(s.INIT_ASDATE), 'MMM yyyy', 'en-US');
              s.CURRENT_ASDATE = formatDate(this.convertDate(s.CURRENT_ASDATE), 'dd MMM yyyy', 'en-US');
              s.VARIANCE_DATE = formatDate(this.convertDate(s.VARIANCE_DATE), 'MMM yyyy', 'en-US');
              this.totalInitLimit += s.INIT_TOTAL_LIMIT;
              this.totalInitCbal += s.INIT_TOTAL_CBAL;
              this.totalTarget += s.TOTAL_TARGET;
              this.totalCurrentLimit += s.CURRENT_TOTAL_LIMIT;
              this.totalCurrentCbal += s.CURRENT_TOTAL_CBAL;
              this.totalDiffTarget += s.DIFF_TARGET;
              this.totalDiffInitLitmit += s.DIFF_INIT_LIMIT;
              this.totalDiffInitCbal += s.DIFF_INIT_CBAL;
              this.totalAvgOutstanding += s.AVG_OUTSTANDING;
            });
          }
        }, error => this.errorService.onRequestError('Get Summary Port', error));
      }
    }, error => this.errorService.onRequestError('Get Role Org', error));
  }
  getSummary2(filter: RmFilterModel) {
    console.log('get summary');
    this.dashboardService.getSummary(filter.department, filter.subDepartment, filter.unit, filter.staff_no).subscribe(summary => {
      this.summary = summary;
      this.totalInitLimit = 0;
      this.totalInitCbal = 0;
      this.totalTarget = 0;
      this.totalCurrentLimit = 0;
      this.totalCurrentCbal = 0;
      this.totalDiffTarget = 0;
      this.totalDiffInitLitmit = 0;
      this.totalDiffInitCbal = 0;
      this.totalAvgOutstanding = 0;
      if (summary.length > 0) {

        this.summary.forEach(s => {
          s.INIT_ASDATE = formatDate(this.convertDate(s.INIT_ASDATE), 'MMM yyyy', 'en-US');
          s.CURRENT_ASDATE = formatDate(this.convertDate(s.CURRENT_ASDATE), 'dd MMM yyyy', 'en-US');
          s.VARIANCE_DATE = formatDate(this.convertDate(s.VARIANCE_DATE), 'MMM yyyy', 'en-US');
          this.totalInitLimit += s.INIT_TOTAL_LIMIT;
          this.totalInitCbal += s.INIT_TOTAL_CBAL;
          this.totalTarget += s.TOTAL_TARGET;
          this.totalCurrentLimit += s.CURRENT_TOTAL_LIMIT;
          this.totalCurrentCbal += s.CURRENT_TOTAL_CBAL;
          this.totalDiffTarget += s.DIFF_TARGET;
          this.totalDiffInitLitmit += s.DIFF_INIT_LIMIT;
          this.totalDiffInitCbal += s.DIFF_INIT_CBAL;
          this.totalAvgOutstanding += s.AVG_OUTSTANDING;
        });
      }
    }, error => this.errorService.onRequestError('Get Summary Port', error));
  }
  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }

  print() {
    $('#summary-table').printThis({
      loadCSS: ['assets/css/main.css', 'assets/css/printing/customersTable.css'],
      header: '<h4 style="text-align: center;">Summary</h4><br>',
      printDelay: 500
    });
  }

  // downloadExcel() {
  //   let data = [];
  //   let temp = this.summary;
  //   temp.push({
  //     DEPT: this.summary[0].DEPT,
  //     SUB_DEPT: this.summary[0].SUB_DEPT,
  //     UNIT: this.summary[0].UNIT,
  //     ALL_PRODUCT_ALCO: 'Total',
  //     INIT_TOTAL_LIMIT: this.totalInitLimit,
  //     INIT_TOTAL_CBAL: this.totalInitCbal,
  //     TOTAL_TARGET: this.totalTarget,
  //     CURRENT_TOTAL_LIMIT: this.totalCurrentLimit,
  //     CURRENT_TOTAL_CBAL: this.totalCurrentCbal,
  //     DIFF_TARGET: this.totalDiffTarget,
  //     DIFF_INIT_LIMIT: this.totalDiffInitLitmit,
  //     DIFF_INIT_CBAL: this.totalDiffInitCbal,
  //     AVG_OUTSTANDING: this.totalAvgOutstanding,
  //     INIT_ASDATE: this.summary[0].INIT_ASDATE,
  //     CURRENT_ASDATE: this.summary[0].CURRENT_ASDATE,
  //     VARIANCE_DATE: this.summary[0].VARIANCE_DATE
  //   });
  //   const initCreditLimit = `Credit Limit (${this.summary[0].INIT_ASDATE})`;
  //   const initOutstanding = `Outstanding (${this.summary[0].INIT_ASDATE})`;
  //   const currentCreditLimit = `Credit Limit (${this.summary[0].CURRENT_ASDATE})`;
  //   const currentOutStanding = `Outstanding (${this.summary[0].CURRENT_ASDATE})`;
  //   const diffCreditLimit = `Credit Limit (Variance ${this.summary[0].VARIANCE_DATE})`;
  //   const diffOutstanding = `Outstanding (Variance ${this.summary[0].VARIANCE_DATE})`;
  //   temp.forEach(sum => {
  //     data.push({
  //       '': sum.ALL_PRODUCT_ALCO,
  //       [initCreditLimit]: sum.INIT_TOTAL_LIMIT,
  //       [initOutstanding]: sum.INIT_TOTAL_CBAL,
  //       'Target Outstanding': sum.TOTAL_TARGET,
  //       [currentCreditLimit]: sum.CURRENT_TOTAL_LIMIT,
  //       [currentOutStanding]: sum.CURRENT_TOTAL_CBAL,
  //       'Variance from Target': sum.DIFF_TARGET,
  //       [diffCreditLimit]: sum.DIFF_INIT_LIMIT,
  //       [diffOutstanding]: sum.DIFF_INIT_CBAL,
  //       'Avg Outstanding': sum.AVG_OUTSTANDING
  //     });
  //   });
  //   this.exportExcel(data, `Summary_${formatDate(new Date(), 'yyyyMMdd', 'en-US')}`);
  // }

  // exportExcel(jsonData: any[], fileName: string): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //   const wb: XLSX.WorkBook = { Sheets: { Summary: ws }, SheetNames: ['Summary'] };
  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   this.saveExcelFile(excelBuffer, fileName);
  // }

  // saveExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: '.xlsx' });
  //   const downloadURL = window.URL.createObjectURL(data);
  //   const link = document.createElement('a');
  //   link.href = downloadURL;
  //   link.download = `${fileName}.xlsx`;
  //   link.click();
  // }
}
