export class CustomerProfileModel {
    Product_Type: string;
    CIFNO: string;
    Product: string;
    Total_CBAL: number;
    AVG_CBAL: number;
    CR_LIMIT: number;
    Seq: number;
    Expanded: boolean;
}

export class GetCustomerProfileModel {
    loans: CustomerProfileModel[];
    deposits: CustomerProfileModel[];
    collateral: CustomerProfileModel;
    mortgage: CustomerProfileModel;
    fees: CustomerProfileModel[];
    nii_acc: CustomerProfileModel;
    nii_ytd: CustomerProfileModel;
}