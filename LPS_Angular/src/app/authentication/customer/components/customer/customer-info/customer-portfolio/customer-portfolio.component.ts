import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerProfileModel } from 'src/app/models/Customer/CustomerProfileModel';
import { colors } from 'src/app/constant/color';
import { CollateralModel, CollateralDetailModel, CollateralFilterModel } from 'src/app/models/Account/CollateralModel';
import { ErrorService } from 'src/app/services/error.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
declare const $;

@Component({
  selector: 'app-customer-portfolio',
  templateUrl: './customer-portfolio.component.html',
  styleUrls: ['./customer-portfolio.component.scss']
})
export class CustomerPortfolioComponent implements OnInit {

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

  constructor(private customerService: CustomerService, private errorService: ErrorService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const cif = params.cif;
      this.getPortfolio(cif);
    });
  }

  getPortfolio(cif) {
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
