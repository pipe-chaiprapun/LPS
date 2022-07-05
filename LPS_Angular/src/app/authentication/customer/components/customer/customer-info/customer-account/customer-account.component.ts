import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ErrorService } from 'src/app/services/error.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { LoanAccountFilterModel } from 'src/app/models/Account/LoanAccountModel';
import { DepositAccountFilterModel, DepositAccountSortingModel } from 'src/app/models/Account/DepositAccountModel';
import { formatDate } from '@angular/common';
import { LoanLimitFilterModel, LoanLimitDetailModel } from 'src/app/models/Account/LoanLimitModel';
import { CollateralModel, CollateralDetailModel, CollateralFilterModel } from 'src/app/models/Account/CollateralModel';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

declare const $;

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss']
})
export class CustomerAccountComponent implements OnInit {

  public readonly itemsPerPage = 20;
  readonly maxPageSize = 5;

  cif: string;

  // Loans limit table
  loanLimits;
  loanlimitCount = 0;
  displayLoanLimits = [];
  loanLimitAlco = ['ALL'];
  loanLimitFilter: LoanLimitFilterModel = new LoanLimitFilterModel();
  loanLimitDetails: LoanLimitDetailModel[];


  // Loans table
  loans;
  loanCount = 0;
  displayLoans = [];
  loanProducts = ['ALL'];
  loanAccountFilter: LoanAccountFilterModel = new LoanAccountFilterModel();
  accountNo: boolean; acType: boolean; productCode: boolean; productGroup: boolean; limitNo: boolean; outstanding: boolean;
  intRate: boolean; issueDate: boolean; maturityDate: boolean; aging: boolean; lateCharge: boolean; miscCharge: boolean; tdrFlag: boolean;
  collaterals: CollateralModel[];
  collateralDetails: CollateralDetailModel[];
  collateralFilter: CollateralFilterModel = new CollateralFilterModel();
  totalCollateralDep = 0;

  // Deposit table
  deposits;
  depositCount = 0;
  displayDeposits = [];
  depositProducts = ['ALL'];
  depositAccountFilter: DepositAccountFilterModel = new DepositAccountFilterModel();
  depositAccountSorting: DepositAccountSortingModel = new DepositAccountSortingModel();

  // Account Servicees
  accServices;

  // Account Relation
  accRelation: any;

  constructor(private accService: AccountService, private errorService: ErrorService, private decimalPipe: DecimalPipe, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const cif = params.cif;
      this.getAccountService(cif);
    });
  }

  getAccountService(cif) {
    this.cif = cif;
    this.loanProducts = ['ALL'];
    this.depositProducts = ['ALL'];
    this.loanLimitAlco = ['ALL'];

    // Get product groups
    this.accService.getProductGroup(cif).subscribe(data => {
      data.loanProducts.forEach(p => this.loanProducts.push(p));
      data.depositProducts.forEach(p => this.depositProducts.push(p));
      data.loanLimitProducts.forEach(p => this.loanLimitAlco.push(p));
    }, error => this.errorService.onRequestError('Get Product Group', error));

    // Get loan limit
    this.loanLimitFilter.startPage = 1;
    this.loanLimitFilter.productAlco = 'ALL';
    this.accService.getLoanLimits({ startPage: 1, limitPage: this.itemsPerPage, cif: this.cif }).subscribe(data => {
      this.displayLoanLimits = data.loans;
      this.loanlimitCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Loan limit Accounts', error));

    // Get loan limit detail
    this.accService.getLoanLitmitDetail(this.cif).subscribe(data => {
      this.loanLimitDetails = data;
    });

    // Get loan accounts
    this.loanAccountFilter.startPage = 1;
    this.loanAccountFilter.productGroup = 'ALL';
    this.accService.getLoanAccounts({ startPage: 1, limitPage: this.itemsPerPage, cif: this.cif }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.PROVISION_DATE) {
          a.PROVISION_DATE = formatDate(this.convertDate(a.PROVISION_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayLoans = data.accounts;
      this.loanCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Loan Accounts', error));

    // Get collaterals


    // Get deposit account
    this.depositAccountFilter.startPage = 1;
    this.depositAccountFilter.productGroup = 'ALL';
    this.accService.getDepositAccounts({ startPage: 1, limitPage: this.itemsPerPage, cif: this.cif }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayDeposits = data.accounts;
      this.depositCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Deposit Accounts', error));

    // Get account Services
    this.accService.getAccServices(this.cif).subscribe(data => {
      this.accServices = data;
    }, error => this.errorService.onRequestError('Get Account Services', error));
  }

  // on page loan limit changed
  pageLoanlimitChanged(event: PageChangedEvent, productAlco) {
    this.loanLimitFilter.startPage = event.page;
    this.loanLimitFilter.productAlco = productAlco.value;
    this.accService.getLoanLimits({
      startPage: event.page, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: this.loanLimitFilter.sortBy, ascending: this.loanLimitFilter.ascending,
      productAlco: productAlco.value
    }).subscribe(data => {
      this.displayLoanLimits = data.loans;
    }, error => this.errorService.onRequestError('Get Loan limit Accounts', error));
  }
  // on loan limit product alco changed
  onLoanLimitAlcoChanged(value: string) {
    this.loanLimitFilter.startPage = 1;
    this.loanLimitFilter.productAlco = value;
    this.accService.getLoanLimits({
      startPage: 1, limitPage: this.itemsPerPage, cif: this.cif,
      productAlco: value
    }).subscribe(data => {
      this.displayLoanLimits = data.loans;
      this.loanlimitCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Loan limit Accounts', error));
  }
  // on sorting loan limit column
  sortLoanLimit(column) {
    this.loanLimitFilter.sortBy = column;
    this[column] = !this[column];
    this.loanLimitFilter.ascending = this[column];

    this.accService.getLoanLimits({
      startPage: this.loanLimitFilter.startPage, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: column, ascending: this[column], productAlco: this.loanLimitFilter.productAlco
    }).
      subscribe(data => {
        this.displayLoanLimits = data.loans;
        this.loanlimitCount = data.totalItems;
      }, error => this.errorService.onRequestError('Sort Loan limit Accounts', error));
  }

  // on page loans changed
  pageLoanChanged(event: PageChangedEvent, productGroup): void {
    this.loanAccountFilter.startPage = event.page;
    this.loanAccountFilter.productGroup = productGroup.value;
    this.accService.getLoanAccounts({
      startPage: event.page, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: this.loanAccountFilter.sortBy, ascending: this.loanAccountFilter.ascending,
      productGroup: productGroup.value
    }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayLoans = data.accounts;
      this.loanCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Loan Accounts', error));
  }

  // on loan product group changed
  onLoanGroupChanged(value: string) {
    this.loanAccountFilter.startPage = 1;
    this.loanAccountFilter.productGroup = value;
    this.accService.getLoanAccounts({
      startPage: 1, limitPage: this.itemsPerPage, cif: this.cif,
      productGroup: value
    }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayLoans = data.accounts;
      this.loanCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Loan Accounts', error));
  }

  // on sorting loan column
  sortLoan(column) {
    this.loanAccountFilter.sortBy = column;
    this[column] = !this[column];
    this.loanAccountFilter.ascending = this[column];

    this.accService.getLoanAccounts({
      startPage: this.loanAccountFilter.startPage, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: column, ascending: this[column], productGroup: this.loanAccountFilter.productGroup
    }).
      subscribe(data => {
        data.accounts.forEach(a => {
          if (a.ISSUE_DATE) {
            a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
          }
          if (a.MATURITY_DATE) {
            a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
          }
        });
        this.loanCount = data.totalItems;
        this.displayLoans = data.accounts;
      }, error => this.errorService.onRequestError('Sort Loan Accounts', error));
  }

  // on page deposits changed
  pageDepositChanged(event: PageChangedEvent, productGroup): void {
    this.depositAccountFilter.startPage = event.page;
    this.depositAccountFilter.productGroup = productGroup.value;
    this.accService.getDepositAccounts({
      startPage: event.page, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: this.depositAccountFilter.sortBy, ascending: this.depositAccountFilter.ascending,
      productGroup: productGroup.value
    }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayDeposits = data.accounts;
      this.depositCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Deposit Accounts', error));
  }

  // on deposit product group changed
  onDepositGroupChanged(value: string) {
    this.depositAccountFilter.startPage = 1;
    this.depositAccountFilter.productGroup = value;
    this.accService.getDepositAccounts({
      startPage: 1, limitPage: this.itemsPerPage, cif: this.cif,
      productGroup: value
    }).subscribe(data => {
      data.accounts.forEach(a => {
        if (a.ISSUE_DATE) {
          a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
        }
        if (a.MATURITY_DATE) {
          a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
        }
      });
      this.displayDeposits = data.accounts;
      this.depositCount = data.totalItems;
    }, error => this.errorService.onRequestError('Get Deposit Accounts', error));
  }

  // on sorting Deposit column
  sortDeposit(column) {
    this.depositAccountFilter.sortBy = column;
    this[column] = !this[column];
    this.depositAccountFilter.ascending = this[column];
    // this.depositAccountSorting[column] = !this.depositAccountSorting[column];
    // this.depositAccountFilter.ascending = this.depositAccountSorting[column];

    this.accService.getDepositAccounts({
      startPage: this.depositAccountFilter.startPage, limitPage: this.itemsPerPage, cif: this.cif,
      sortBy: column, ascending: this[column],
      productGroup: this.depositAccountFilter.productGroup
    }).
      subscribe(data => {
        data.accounts.forEach(a => {
          if (a.ISSUE_DATE) {
            a.ISSUE_DATE = formatDate(this.convertDate(a.ISSUE_DATE), 'dd/MM/yyyy', 'en-US');
          }
          if (a.MATURITY_DATE) {
            a.MATURITY_DATE = formatDate(this.convertDate(a.MATURITY_DATE), 'dd/MM/yyyy', 'en-US');
          }
        });
        this.depositCount = data.totalItems;
        this.displayDeposits = data.accounts;
      }, error => this.errorService.onRequestError('Sort Deposit Accounts', error));
  }

  viewLoanRelation(accountNo) {
    this.accService.getLoanAccountRelation(accountNo).subscribe(data => {
      this.accRelation = data;
    }, error => this.errorService.onRequestError('Get Account Relation', error));
  }

  viewDepositRelation(accountNo) {
    this.accService.getDepositAccountRelation(accountNo).subscribe(data => {
      this.accRelation = data;
    }, error => this.errorService.onRequestError('Get Deposit Account Relation', error));
  }

  viewAccountCollateral(account) {
    this.collaterals = [];
    $('#collateral-content2').animate({ scrollTop: 0 });
    this.collateralFilter.account_no = account.ACCTNO;
    this.accService.getAccCollateral2({ account_no: account.ACCTNO }).subscribe(data => {
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
    }, error => this.errorService.onRequestError('Get Account collateral', error));
    // this.accService.getAccCollateral(accountNo.ACCTNO).subscribe(data => {
    //   this.collaterals = data;
    // }, error => this.errorService.onRequestError('Get Account collateral', error));
  }
  sortCollateral(column: string) {
    this.collateralFilter.sortBy = column;
    this[column] = !this[column];
    this.collateralFilter.ascending = this[column];

    this.accService.getAccCollateral2({ account_no: this.collateralFilter.account_no, sortby: column, ascending: this[column] }).subscribe(data => {
      this.collaterals = data;
      if (this.collaterals.length > 0) {
        this.collaterals.forEach(c => {
          c.VALUATION_DATE = c.VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
          c.NEXT_VALUATION_DATE = c.NEXT_VALUATION_DATE == null ? '' :
            formatDate(this.convertDate(c.NEXT_VALUATION_DATE), 'dd/MM/yyyy', 'en-US');
        });
      }
    }, error => this.errorService.onRequestError('Get Account collateral', error));
  }

  viewOthers(loan) {
    $('#lateCharge').val(this.decimalPipe.transform(loan.LATE_CHARGE, '1.2-2'));
    $('#miscCharge').val(this.decimalPipe.transform(loan.MISC_CHARGE, '1.2-2'));
    $('#provisionCharge').val(this.decimalPipe.transform(loan.PROVISION_TFRS9, '1.2-2'));
    $('#provisionDate').text(`* ข้อมูล ณ วันที่ ${loan.PROVISION_DATE}`);
    $('#othersModal').modal('show');
  }

  viewColDetails(value) {
    this.collateralDetails = [];
    this.accService.getAccCollateralDetail(value.CCDCID).subscribe(data => {
      this.collateralDetails = data;
    }, error => this.errorService.onRequestError('Get Collateral detail', error));
    // return this.collateralDetails.filter(x => x.id === value.id);
  }

  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }

  getCollateralType(cate: string) {
    return cate.substring(0, 3);
  }

}
