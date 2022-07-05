export class LoanLimitModel {
    LIMIT_NO: string;
    ALL_PRODUCT_ALCO: string;
    TOTAL_LIMIT: number;
}

export class GetLoanLimitModel {
    loans: LoanLimitModel[];
    totalItems: number;
}

export class LoanLimitFilterModel {
    startPage: number;
    limitPage: number;
    cif: string;
    sortBy: string;
    ascending: boolean;
    productAlco: string;
}

export class LoanLimitDetailModel {
    AFOFFR: string;
    AFAPNO: string;
    AFFCDE: string;
    AFSEQ: string;
    AFLEVL: string;
    AFLTYP: string;
    AFCPNO: string;
    AFCUR: string;
    AFFAMT: number;
    children: LoanLimitDetailModel[];
    expanded: boolean;
}