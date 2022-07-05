import { OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerProfileModel } from 'src/app/models/Customer/CustomerProfileModel';
import { colors } from 'src/app/constant/color';
import { CollateralModel, CollateralDetailModel, CollateralFilterModel } from 'src/app/models/Account/CollateralModel';
import { ErrorService } from 'src/app/services/error.service';
import { formatDate } from '@angular/common';
declare const $;

// @Component({
//   selector: 'app-portfolio',
//   templateUrl: './portfolio.component.html',
//   styleUrls: ['./portfolio.component.scss']
// })
export class PortfolioComponent implements OnInit {

  loan: CustomerProfileModel[];
  loanTotalCr: number;
  loanTotalCbal: number;
  loanTotalAvg: number;
  collaterals: CollateralModel[];
  collateralDetails: CollateralDetailModel[];
  collateralFilter: CollateralFilterModel = new CollateralFilterModel();
  totalCollateralDep = 0;

  deposit: CustomerProfileModel[];
  depositTotalBal: number;
  depositTotalAvg: number;

  fee: CustomerProfileModel[];
  feeTotalAmt: number;

  collateral: CustomerProfileModel;
  mortgage: CustomerProfileModel;
  niiAcc: CustomerProfileModel;
  niiYtd: CustomerProfileModel;

  depositTypeChart: any;
  loanTypeChart: any;
  feeTypeChart: any;
  depositDataChart: any;
  loanDataChart: any;
  feeDataChart: any;
  depositOptionChart: any;
  loanOptionChart: any;
  feeOptionChart: any;
  depositChartDisplay = false;
  loanChartDisplay = false;
  feeChartDisplay = false;
  colors;
  borderColors;

  constructor(private customerService: CustomerService, private errorService: ErrorService) { }

  ngOnInit() {
    this.colors = colors.chart.colors;
    this.borderColors = colors.chart.borderColors;
  }

  getPortfolio(cif) {
    this.depositChartDisplay = false;
    this.loanChartDisplay = false;
    this.feeChartDisplay = false;
    this.loanTotalAvg = 0;
    this.loanTotalCbal = 0;
    this.loanTotalCr = 0;
    this.depositTotalAvg = 0;
    this.depositTotalBal = 0;
    this.feeTotalAmt = 0;

    this.collateralFilter.cif = cif;

    this.customerService.getCustomerProfile(cif).subscribe(data => {
      this.loan = data.loans;
      this.deposit = data.deposits;
      this.fee = data.fees;
      this.niiAcc = data.nii_acc;
      this.niiYtd = data.nii_ytd;
      this.collateral = data.collateral;
      this.mortgage = data.mortgage;

      if (this.loan.length > 0) {
        this.loan.forEach(t => {
          this.loanTotalCr += t.CR_LIMIT;
          this.loanTotalCbal += t.Total_CBAL;
          this.loanTotalAvg += t.AVG_CBAL;
        });
      }
      if (this.deposit.length > 0) {
        this.deposit.forEach(t => {
          this.depositTotalBal += t.Total_CBAL;
          this.depositTotalAvg += t.AVG_CBAL;
        });
      }
      if (this.fee.length > 0) {
        this.fee.forEach(t => {
          this.feeTotalAmt += t.Total_CBAL;
        });
      }
    }, error => this.errorService.onRequestError('Get Portfolio', error));

    this.customerService.getCustomerCollateral(cif).subscribe(data => {
      this.collaterals = data;
      this.totalCollateralDep = 0;
      if (this.collaterals.length > 0) {
        this.collaterals.forEach(c => {
          if (this.getCollateralType(c.COLLATERAL_CAT) === 'DEP') {
            this.totalCollateralDep += c.CCDCMV;
          }
        });
      }
    }, error => this.errorService.onRequestError('Get collateral', error));

  }

  viewCollaterals() {
    this.collaterals = [];
    $('#collateral-content').animate({ scrollTop: 0 });

    this.customerService.getCustomerCollateral2({ cif: this.collateralFilter.cif }).subscribe(data => {
      this.collaterals = data;
      this.totalCollateralDep = 0;
      if (this.collaterals.length > 0) {
        this.collaterals.forEach(c => {
          if (this.getCollateralType(c.COLLATERAL_CAT) === 'DEP') {
            this.totalCollateralDep += c.CCDCMV;
          }
          c.VALUATION_DATE = c.VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
          c.NEXT_VALUATION_DATE = c.NEXT_VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.NEXT_VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
        });
      }
    }, error => this.errorService.onRequestError('Get collateral', error));
  }

  sort(column: string) {
    this.collateralFilter.sortBy = column;
    this[column] = !this[column];
    this.collateralFilter.ascending = this[column];

    this.customerService.getCustomerCollateral2({ cif: this.collateralFilter.cif, sortby: column, ascending: this[column] }).subscribe(data => {
      this.collaterals = data;
      if (this.collaterals.length > 0) {
        this.collaterals.forEach(c => {
          c.VALUATION_DATE = c.VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
          c.NEXT_VALUATION_DATE = c.NEXT_VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.NEXT_VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
        });
      }
    }, error => this.errorService.onRequestError('Get collateral', error));
  }

  genChart(product) {
    // switch (product) {
    //   case 'loan': {
    //     if (this.loan.length > 0) {
    //       this.loanChartDisplay = !this.loanChartDisplay;
    //       let products = [];
    //       let balances = [];
    //       let formatNumber = {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //       };
    //       this.loan.forEach(t => {
    //         balances.push(t.Total_CBAL);
    //         let percent = (t.Total_CBAL * 100) / this.loanTotalCbal;
    //         products.push(t.Product + ` (${percent.toLocaleString('en', formatNumber)}%)`);
    //       });
    //       this.loanTypeChart = 'pie';
    //       this.loanDataChart = {
    //         labels: products,
    //         datasets: [
    //           {
    //             data: balances,
    //             backgroundColor: this.colors,
    //           }
    //         ]
    //       };
    //       this.loanOptionChart = {
    //         responsive: true,
    //         maintainAspectRatio: true,
    //         tooltips: {
    //           callbacks: {
    //             label: (item, data) => {
    //               return balances[item.index].toLocaleString('en', formatNumber);
    //             }
    //           }
    //         }
    //       };
    //     }
    //     break;
    //   }
    //   case 'deposit': {
    //     if (this.deposit.length > 0) {
    //       this.depositChartDisplay = !this.depositChartDisplay;
    //       let products = [];
    //       let balances = [];
    //       let formatNumber = {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //       };
    //       this.deposit.forEach(t => {
    //         balances.push(t.Total_CBAL);
    //         let percent = (t.Total_CBAL * 100) / this.depositTotalBal;
    //         products.push(t.Product + ` (${percent.toLocaleString('en', formatNumber)}%)`);
    //       });
    //       this.depositTypeChart = 'pie';
    //       this.depositDataChart = {
    //         labels: products,
    //         datasets: [
    //           {
    //             data: balances,
    //             backgroundColor: this.colors,
    //           }
    //         ]
    //       };
    //       this.depositOptionChart = {
    //         responsive: true,
    //         maintainAspectRatio: true,
    //         tooltips: {
    //           callbacks: {
    //             label: (item, data) => {
    //               return balances[item.index].toLocaleString('en', formatNumber);
    //             }
    //           }
    //         }
    //       };
    //     }
    //     break;
    //   }
    //   case 'fee': {
    //     if (this.fee.length > 0) {
    //       this.feeChartDisplay = !this.feeChartDisplay;
    //       let products = [];
    //       let balances = [];
    //       let formatNumber = {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //       };
    //       this.fee.forEach(t => {
    //         balances.push(t.Total_CBAL);
    //         let percent = (t.Total_CBAL * 100) / this.feeTotalAmt;
    //         products.push(t.Product + ` (${percent.toLocaleString('en', formatNumber)}%)`);
    //       });
    //       this.feeTypeChart = 'pie';
    //       this.feeDataChart = {
    //         labels: products,
    //         datasets: [
    //           {
    //             data: balances,
    //             backgroundColor: this.colors,
    //           }
    //         ]
    //       };
    //       this.feeOptionChart = {
    //         responsive: true,
    //         maintainAspectRatio: true,
    //         tooltips: {
    //           callbacks: {
    //             label: (item, data) => {
    //               return balances[item.index].toLocaleString('en', formatNumber);
    //             }
    //           }
    //         }
    //       };
    //     }
    //     break;
    //   }
    // }
  }

  viewColDetails(value) {
    this.collateralDetails = [];
    this.customerService.getCustomerCollateralDetail(value.CCDCID).subscribe(data => {
      this.collateralDetails = data;
    }, error => this.errorService.onRequestError('Get Collateral detail', error));
    // return this.collateralDetails.filter(x => x.id === value.id);
  }

  getCollateralType(cate: string) {
    return cate.substring(0, 3);
  }
  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }
}
