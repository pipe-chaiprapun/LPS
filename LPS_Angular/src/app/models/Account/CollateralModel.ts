export class CollateralModel {
    ACCTNO: string;
    CIFNO: string;
    CCDCID: string;
    CCDNAM: string;
    CCDDSC: string;
    COLLATERAL_CAT: string;
    CCDCMV: number;
    VALUATION_DATE: string;
    NEXT_VALUATION_DATE: string;
    DETAIL_FLAG: string;
    COLLATERAL_DETAILS: CollateralDetailModel[];
    expanded: boolean;
}
export class CollateralDetailModel {
    CCDCID: string;
    SEQ: number;
    PARAM_NAME: string;
    PARAM_VALUE: string;
    DISPLAY_NAME: string;
    NUMBER_FORMAT_FLAG: string;
}
export class CollateralFilterModel {
    cif: string;
    account_no: string;
    sortBy: string;
    ascending: boolean;
}
