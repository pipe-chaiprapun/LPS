export class LoanAccountModel {
    ACCTNO: string;
    ACTYPE: string;
    PRODUCT_CODE: string;
    PRODUCT_GROUP: string;
    LIMIT_NO: string;
    OUTSTANDING: number;
    INT_RATE: number;
    ISSUE_DATE: string;
    MATURITY_DATE: string;
    AGING: string;
    LATE_CHARGE: number;
    MISC_CHARGE: number;
    TDR_FLAG: string;
    PROVISION_TFRS9: number;
    PROVISION_DATE: string;
}

export class GetLoanAccountModel {
    accounts: LoanAccountModel[];
    totalItems: number;
}

export class LoanAccountFilterModel {
    startPage: number;
    limitPage: number;
    cif: string;
    sortBy: string;
    ascending: boolean;
    productGroup: string;
}