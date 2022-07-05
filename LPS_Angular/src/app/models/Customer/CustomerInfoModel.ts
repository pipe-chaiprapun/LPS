import { CustomerModel } from './CustomerModel';

export class CustomerInfoModel {
    // cif: string;
    // registerDate: string;
    // address: string;
    // telephone: string;
    // fax: string;
    // noStaff: number;
    // netAsset: number;
    // netProfit: number;
    // businessSize: string;
    // classification: string;
    // watchList: string;
    // reschedule: string;
    customerInfo: CustomerModel;
    customerGroup: CustomerGroup[];
    creditRating: CreditRating[];
    contactInfo: ContactInfo[];
    watchlist: CustomerWatchList[];
}
class ContactInfo {
    CONTACT_NAME: string;
    CONTACT_TEL: string;
}
export class CustomerGroup {
    groupNo: number;
    groupName: string;
    data: CustomerGroupData[];
}
class CustomerGroupData {
    cif: string;
    customerName: string;
    relation: string;
}
class CreditRating {
    RATING_TYPE: string;
    RATING_COMPANY: string;
    RATING: string;
    RATING_DATE: string;
}
class CustomerWatchList {
    WATCH_LIST_FLAG: string;
    WATCH_LIST_NOTE: string;
    CREATE_DATE: string;
    MATURITY_DATE: string;
}
