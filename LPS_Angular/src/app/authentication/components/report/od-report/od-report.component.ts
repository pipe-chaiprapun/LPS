import { OnInit, OnDestroy } from '@angular/core';
import { OdStatementModel, OdAccount } from 'src/app/models/Report/OdStatementModel';
import { ErrorService } from 'src/app/services/error.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Router, NavigationEnd } from '@angular/router';
import { MasterDataModel } from 'src/app/models/User/ParameterModel';
import { ReportService } from 'src/app/services/report.service';
declare const $;
declare const App;

// @Component({
//   selector: 'app-od-report',
//   templateUrl: './od-report.component.html',
//   styleUrls: ['./od-report.component.scss']
// })
export class OdReportComponent implements OnInit, OnDestroy {
  currentDepartment: string;
  navigationSubscription;
  statements: OdStatementModel[];
  accounts: OdAccount[];
  currentDate: string;
  dateOpts = [];
  accounts2;
  totalCredit = 0;
  totalCreditTurnover = 0;
  totalDebit = 0;
  totalDebitTurnover = 0;
  totalMonthlyInterest = 0;
  totalReturnItem = 0;
  totalDepCheckAmt = 0;
  avgCredit = 0;
  avgTurnoverCredit = 0;
  avgDebit = 0;
  avgTurnoverDebit = 0;
  count = 0;

  odLimit = 0;
  perOfOdUtil = 0;
  avgSwing = 0;
  avgPerOfSwing = 0;

  avgReturnCheckItem = 0;
  avgReturnCheckItemAmt = 0;
  avgReturnCheckAmtByItem = 0;

  reviewDate: MasterDataModel;
  currentAccNo = '';
  currentAccName = '';
  currentCostCenter = '';
  currentCostCenterName = '';
  currentBranchZone = '';
  currentNoMonth = '';
  currentOdRate = '';
  currentBranch = '';

  constructor(private reportService: ReportService, private errorService: ErrorService,
    private authService: AuthorizationService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        // const reportId = this.router.url.split('/')[1];
        const reportId = 'R1000';
        this.reportService.getReportAuth(reportId, this.authService.getUserProfile.currentRole.ROLE_CODE, this.authService.getUserProfile.user.username)
          .subscribe((data) => { }, error => this.errorService.onRequestError('Check report auth', error),
            () => this.initAccountList());
      }
    });
  }

  initAccountList() {
    this.statements = null;
    this.currentAccNo = '';
    // const roleCode = this.currentDepartment.substring(0, 2);
    const roleCode = this.authService.getUserProfile.currentRole.ROLE_CODE;
    $('#optAccName').val(0).change();
    this.currentDepartment = this.authService.getCurrentUserDepartment.ROLE_CODE;
    this.reportService.getOdAccount('', roleCode)
      .subscribe((data) => this.accounts = data,
        error => this.errorService.onRequestError('Get OD Account', error));
  }

  ngOnInit() {
    // App.initLoadPage();
    this.reviewDate = this.authService.getMasterData.find(m => m.key === 'OD_DATE');


    // $('#txtAsDate').datepicker({
    //   format: 'MM yyyy',
    //   autoclose: true,
    //   todayHighlight: true,
    //   viewMode: 'months',
    //   minViewMode: 'months',
    // }).on('changeDate', (ev) => {
    //   if (ev.date) {
    //     const lastDay = new Date(ev.date.getFullYear(), ev.date.getMonth() + 1, 0);
    //     this.lastDate = formatDate(lastDay, 'yyyyMMdd', 'en-US');
    //     if (this.currentAccNo) {
    //       this.viewStatement(this.currentAccNo);
    //     }
    //   }
    // });

    // const currentDate = new Date();
    // const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    // this.reviewDate = previousMonth;
    // $('#txtAsDate').datepicker('setDate', this.lastDate);

    if (this.reviewDate) {
      this.currentDate = this.reviewDate.value;
      const date = this.convertDate(this.reviewDate.value);
      const currentDate = formatDate(date, 'MMM yyyy', 'en-US');

      this.dateOpts.push({ label: currentDate, value: this.reviewDate.value });
      this.dateOpts.push({
        label: formatDate(new Date(date.getFullYear() - 1, 11, 31), 'MMM yyyy', 'en-US'),
        value: formatDate(new Date(date.getFullYear() - 1, 11, 31), 'yyyyMMdd', 'en-US')
      });
      this.dateOpts.push({
        label: formatDate(new Date(date.getFullYear() - 2, 11, 31), 'MMM yyyy', 'en-US'),
        value: formatDate(new Date(date.getFullYear() - 2, 11, 31), 'yyyyMMdd', 'en-US')
      });


      // $('#txtAsDate').val(formatDate(date, 'MMM yyyy', 'en-US'));
    }

    $('#optAccName').select2({ width: '100%' });
    $('#optAccName').on('select2:select', (e) => {
      const selectedAcc = e.currentTarget.value;
      this.currentAccNo = selectedAcc;
      if (selectedAcc) {
        this.viewStatement(selectedAcc);
      }
      // const selected = e.currentTarget.value;
      // let num = selected.match(/\d/g);
      // num = num.join('');
      // if (num.length > 0) {
      //   this.currentAccNo = num;
      //   this.viewStatement(num);
      // }
    });
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  genOption(value) {
    return `${value.ACC_NO} [ ${value.ACC_NAME} ]`;
  }

  onDateChanged() {
    this.currentDate = $('#dateOption :selected').val();
    if (this.currentAccNo) {
      this.clearVariable();
      Swal.fire({
        titleText: 'Fetching statement',
        icon: 'info',
        timerProgressBar: true,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
          this.reportService.getOdStatement(this.currentDate, this.currentAccNo).subscribe(data => {
            if (data.length > 0) {
              this.statements = data;
              this.count = this.statements.length;

              this.currentAccNo = this.statements[0].ACC_NO.toString();
              this.currentAccName = this.statements[0].ACC_NAME;
              this.currentCostCenter = this.statements[0].COST_CENTER.toString();
              this.currentCostCenterName = this.statements[0].COST_CENTER_NAME;
              this.currentBranchZone = this.statements[0].ZONE_NAME;
              this.currentNoMonth = this.statements[0].NUMBER_OF_MONTH.toString();
              this.currentOdRate = this.statements[0].OD_RATE.toString() + '%';
              this.currentBranch = this.statements[0].BRH_NAME;

              this.statements.forEach(c => {
                this.totalCredit += c.CREDIT;
                this.totalCreditTurnover += c.TURNOVER_CREDIT;
                this.totalDebit += c.DEBIT;
                this.totalDebitTurnover += c.TURNOVER_DEBIT;
                this.totalMonthlyInterest += c.MONTHLY_INTEREST;
                this.totalReturnItem += c.RETURN_ITEM;
                this.totalDepCheckAmt += c.DEP_CHECK_AMT;
                this.avgCredit = this.totalCredit / this.count;
                this.avgTurnoverCredit = this.totalCreditTurnover / this.count;
                this.avgDebit = this.totalDebit / this.count;
                this.avgTurnoverDebit = this.totalDebitTurnover / this.count;
              });
              // this.avgCredit = this.totalCredit / this.count;
              // this.avgTurnoverCredit = this.totalCreditTurnover / this.count;
              // this.avgDebit = this.totalDebit / this.count;
              // this.avgTurnoverDebit = this.totalDebitTurnover / this.count;

              this.odLimit = this.statements[0].OD_LIMIT;
              this.perOfOdUtil = this.statements[0].PER_OF_OD_UTIL;
              this.avgSwing = this.statements[0].AVG_SWING;
              this.avgPerOfSwing = this.statements[0].AVG_PER_OF_SWING;

              this.avgReturnCheckItem = this.statements[0].AVG_RETURN_CHECK_ITEM;
              this.avgReturnCheckItemAmt = this.statements[0].AVG_RETURN_CHECK_AMT;
              this.avgReturnCheckAmtByItem = this.statements[0].AVG_RETURN_CHECK_AMT_ITEM;
            } else {
              this.statements = null;
              Swal.fire({
                title: 'Fetching OD Statement',
                text: 'Not found statement of this account!',
                icon: 'error',
                showCloseButton: true,
                showConfirmButton: false,
                timer: 3000
              });
            }
          }, error => this.errorService.onRequestError('Get OD Statement', error), () => Swal.close());
        },
        onAfterClose: () => {
        }
      });
    }
  }

  viewStatement(value) {
    if (value && this.currentDate) {
      this.clearVariable();
      Swal.fire({
        titleText: 'Fetching statement',
        icon: 'info',
        timerProgressBar: true,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
          this.reportService.getOdStatement(this.currentDate, value).subscribe(data => {
            if (data.length > 0) {
              this.statements = data;
              this.count = this.statements.length;

              this.currentAccNo = this.statements[0].ACC_NO.toString();
              this.currentAccName = this.statements[0].ACC_NAME;
              this.currentCostCenter = this.statements[0].COST_CENTER.toString();
              this.currentCostCenterName = this.statements[0].COST_CENTER_NAME;
              this.currentBranchZone = this.statements[0].ZONE_NAME;
              this.currentNoMonth = this.statements[0].NUMBER_OF_MONTH.toString();
              this.currentOdRate = this.statements[0].OD_RATE.toString() + '%';
              this.currentBranch = this.statements[0].BRH_NAME;

              this.statements.forEach(c => {
                this.totalCredit += c.CREDIT;
                this.totalCreditTurnover += c.TURNOVER_CREDIT;
                this.totalDebit += c.DEBIT;
                this.totalDebitTurnover += c.TURNOVER_DEBIT;
                this.totalMonthlyInterest += c.MONTHLY_INTEREST;
                this.totalReturnItem += c.RETURN_ITEM;
                this.totalDepCheckAmt += c.DEP_CHECK_AMT;
                this.avgCredit = this.totalCredit / this.count;
                this.avgTurnoverCredit = this.totalCreditTurnover / this.count;
                this.avgDebit = this.totalDebit / this.count;
                this.avgTurnoverDebit = this.totalDebitTurnover / this.count;
              });

              this.odLimit = this.statements[0].OD_LIMIT;
              this.perOfOdUtil = this.statements[0].PER_OF_OD_UTIL;
              this.avgSwing = this.statements[0].AVG_SWING;
              this.avgPerOfSwing = this.statements[0].AVG_PER_OF_SWING;

              this.avgReturnCheckItem = this.statements[0].AVG_RETURN_CHECK_ITEM;
              this.avgReturnCheckItemAmt = this.statements[0].AVG_RETURN_CHECK_AMT;
              this.avgReturnCheckAmtByItem = this.statements[0].AVG_RETURN_CHECK_AMT_ITEM;
            } else {
              this.statements = null;
              Swal.fire({
                title: 'Fetching OD Statement',
                text: 'Not found statement of this account!',
                icon: 'error',
                showCloseButton: true,
                showConfirmButton: false,
                timer: 3000
              });
            }
          }, error => this.errorService.onRequestError('Get OD Statement', error), () => Swal.close());
        },
        onAfterClose: () => {
        }
      });
    }
  }
  downloadReport() {
    this.currentDate = $('#dateOption :selected').val();
    if (this.currentAccNo) {
      Swal.fire({
        titleText: 'Generating PDF File',
        icon: 'info',
        timerProgressBar: true,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
          this.reportService.downloadOdAccount(this.currentAccNo, this.currentDate).subscribe(data => {
            // Swal.fire({
            //   title: 'Downloaded File',
            //   icon: 'success',
            //   showConfirmButton: false,
            //   showCloseButton: true,
            //   timer: 1500
            // });
            const downloadURL = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = `OD_${this.currentAccNo}.pdf`;
            Swal.close();
            link.click();
          }, error => this.errorService.onRequestError('Download PDF File', error), () => Swal.close());
        },
        onAfterClose: () => {
        }
      });
    }
  }
  clearVariable() {
    this.totalCredit = 0;
    this.totalCreditTurnover = 0;
    this.totalDebit = 0;
    this.totalDebitTurnover = 0;
    this.totalMonthlyInterest = 0;
    this.totalReturnItem = 0;
    this.totalDepCheckAmt = 0;
    this.avgCredit = 0;
    this.avgTurnoverCredit = 0;
    this.avgDebit = 0;
    this.avgTurnoverDebit = 0;
    this.count = 0;

    this.odLimit = 0;
    this.perOfOdUtil = 0;
    this.avgSwing = 0;
    this.avgPerOfSwing = 0;

    this.avgReturnCheckItem = 0;
    this.avgReturnCheckItemAmt = 0;
    this.avgReturnCheckAmtByItem = 0;
  }
  clear() {
    this.clearVariable();
    // const currentDate = new Date();
    // const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    // this.reviewDate = previousMonth;

    this.statements = null;
    // this.lastDate = null;
    this.currentAccNo = '';
    this.currentDate = this.reviewDate.value;
    // $('#txtAsDate').datepicker('setDate', null);
    // $('#txtAsDate').datepicker('setDate', this.lastDate);
    $('#optAccName').val(0).change();
    $('#dateOption').val(this.reviewDate.value).change();
  }

  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }

}
