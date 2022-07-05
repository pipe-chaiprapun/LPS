export class DepositAccountModel {
    ACCTNO: string;
    ACTYPE: string;
    PRODUCT_CODE: string;
    PRODUCT_GROUP: string;
    BALANCE: number;
    INT_RATE: number;
    ISSUE_DATE: string;
    MATURITY_DATE: string;
}
export class GetDepositAccountModel {
    accounts: DepositAccountModel[];
    totalItems: number;
}
export class DepositAccountFilterModel {
    startPage: number;
    limitPage: number;
    cif: string;
    sortBy: string;
    ascending: boolean;
    productGroup: string;
}
export class DepositAccountSortingModel {
    accountNo: boolean;
    acType: boolean;
    productCode: boolean;
    productGroup: boolean;
    balance: boolean;
    intRate: boolean;
    issueDate: boolean;
    maturityDate: boolean;
}
