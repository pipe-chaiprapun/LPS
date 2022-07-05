// export class CustomerModel {
//     CIF_KEY: number;
//     CUSTOMER_NAME: string;
//     CREDIT_LIMIT: number;
//     OUTSTANDING: number;
//     YIELD?: number;
// }
export class CustomerModel {
    DEPT: string;
    SUB_DEPT: string;
    UNIT: string;
    CIF_KEY: number;
    CUSTOMER_NAME: string;
    CREDIT_LIMIT: number;
    OUTSTANDING_CASH: number;
    OUTSTANDING_NON_CASH: number;
    YIELD: number;
    STAFF_NAME: string;
    REGISTER_DATE: string;
    CUSTOMER_ADDRESS: string;
    TELEPHONE: string;
    FAX: string;
    NO_OF_STAFF: number;
    NET_PROFIT: number;
    NET_ASSET: number;
    BUSINESS_SIZE: string;
    CLASSIFICATION: string;
    WATCHLIST_FLAG: string;
    RESCHEDULE_FLAG: string;
    TDR_FLAG: string;
    TOTAL_PROVISION: number;
    PARAM_VALUE: string;
    REGISTRATION_NO: string;
    DR_FLAG: string;
    NDR_FLAG: string;
}

export class GetCustomerModel {
    customers: CustomerModel[];
    totalItems: number;
}
