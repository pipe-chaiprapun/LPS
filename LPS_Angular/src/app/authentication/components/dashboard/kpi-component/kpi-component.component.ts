import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ErrorService } from 'src/app/services/error.service';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { KpiModel } from 'src/app/models/Dashboard/GetKpiModel';
import { formatDate } from '@angular/common';
// import * as XLSX from 'xlsx';

@Component({
  selector: 'app-kpi-component',
  templateUrl: './kpi-component.component.html',
  styleUrls: ['./kpi-component.component.scss']
})
export class KpiComponentComponent implements OnInit {
  constructor(private dashboardService: DashboardService, private errorService: ErrorService) { }

  typeChart: any;
  dataChart: any;
  optionsChart: any;
  kpi: KpiModel[];
  date: string;
  month: string;
  expand = false;

  currentSession: CurrentSessionModel;

  ngOnInit() {
    // this.currentSession = this.authService.getUserProfile;
    // this.dashboardService.getKPI(this.currentSession.currentRole.ROLE_CODE).subscribe(data => {
    //   this.kpi = data.kpi;
    //   this.date = formatDate(data.date, 'MMM yyyy', 'en-US');
    // }, error => this.errorService.onRequestError('KPI', error));
  }
  getKpi(roleCode) {
    // this.currentSession = this.authService.getUserProfile;
    console.log('get kpi');
    this.dashboardService.getKPI(roleCode).subscribe(data => {
      this.kpi = data.kpi;
      this.date = formatDate(data.date, 'MMM yyyy', 'en-US');
      this.month = formatDate(data.date, 'MMM', 'en-US');
    }, error => this.errorService.onRequestError('KPI', error));
  }
  // print() {
  //   $('#kpi-table').printThis({
  //     loadCSS: ['assets/css/main.css', 'assets/css/printing/customersTable.css'],
  //     header: '<h4 style="text-align: center;">KPI</h4><br>',
  //     printDelay: 500
  //   });
  // }
  // downloadExcel() {
  //   let data = [];
  //   const date = this.date;
  //   this.kpi.forEach(k => {
  //     data.push({
  //       '': k.TOPIC,
  //       Target: k.LOAN_TARGET,
  //       YTD: k.YTD,
  //       Diff: k.DIFF,
  //       [date]: k.ACTUAL
  //     });
  //   });
  //   this.exportExcel(data, `KPI_${formatDate(new Date(), 'yyyyMMdd', 'en-US')}`);
  // }
  // exportExcel(jsonData: any[], fileName: string): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //   const wb: XLSX.WorkBook = { Sheets: { KPI: ws }, SheetNames: ['KPI'] };
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

  // generateChart() {
  //   let label = []
  //   let targets = [];
  //   let ytds = [];
  //   let diffs = [];
  //   let months = [];

  //   this.kpi.kpi.data.forEach(d => {
  //     label.push(d.type);
  //     targets.push(d.target);
  //     ytds.push(d.ytd);
  //     diffs.push(d.diff);
  //     months.push(d.kpiOfMonth);
  //   });

  //   console.log(targets);
  //   console.log(ytds);
  //   console.log(diffs);
  //   console.log(months);
  //   let colors = ['#90E6E6', '#7CC7F9', '#FF9EB', '#82CDFF'];

  //   this.typeChart = 'bar';
  //   this.dataChart = {
  //     labels: ['Net Growth (ฝ่าย)'],
  //     datasets: [
  //       {
  //         label: 'Target',
  //         data: [1740],
  //         backgroundColor: '#90E6E6',
  //         borderColor: '#29BABC',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'YTD',
  //         data: [3000],
  //         backgroundColor: '#FFE099',
  //         borderColor: '#E6A100',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'Diff',
  //         data: [1260],
  //         backgroundColor: '#FF9EB3',
  //         borderColor: '#ff6687',
  //         borderWidth: 1
  //       },
  //       {
  //         label: this.kpi.kpi.month,
  //         data: [3000],
  //         backgroundColor: '#82CDFF',
  //         borderColor: '#008ae6',
  //         borderWidth: 1
  //       }
  //     ]
  //   };
  //   this.optionsChart = {
  //     responsive: true,
  //     maintainAspectRatio: true,
  //     scales: {
  //       xAxes: [{
  //         ticks: { fontSize: 10 }
  //       }]
  //     }
  //   };
  // }

  // viewChart(row) {
  //   this.toggle = !this.toggle;
  //   const label = [];
  //   const targets = [];
  //   const ytds = [];
  //   const diffs = [];
  //   const months = [];

  //   label.push(row.type);
  //   targets.push(row.target);
  //   ytds.push(row.ytd);
  //   diffs.push(row.diff);
  //   months.push(row.kpiOfMonth);

  //   this.typeChart = 'bar';
  //   this.dataChart = {
  //     labels: label,
  //     datasets: [
  //       {
  //         label: 'Target',
  //         data: targets,
  //         backgroundColor: '#90E6E6',
  //         borderColor: '#29BABC',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'YTD',
  //         data: ytds,
  //         backgroundColor: '#FFE099',
  //         borderColor: '#E6A100',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'Diff',
  //         data: diffs,
  //         backgroundColor: '#FF9EB3',
  //         borderColor: '#ff6687',
  //         borderWidth: 1
  //       },
  //       {
  //         label: this.kpi.kpi.month,
  //         data: months,
  //         backgroundColor: '#82CDFF',
  //         borderColor: '#008ae6',
  //         borderWidth: 1
  //       }
  //     ]
  //   };
  //   this.optionsChart = {
  //     responsive: true,
  //     maintainAspectRatio: true,
  //     scales: {
  //       xAxes: [{
  //         ticks: { fontSize: 14 }
  //       }]
  //     }
  //   };
  // }
}
