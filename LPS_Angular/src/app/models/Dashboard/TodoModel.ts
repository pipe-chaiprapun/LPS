export class TodoModel {
    DEPT: string;
    SUB_DEPT: string;
    UNIT: string;
    TO_DO_TOPIC: string;
    NO_CIF: number;
    TOTAL_AMT: number;
}
export class TodoDetailModel {
    DEPT: string;
    SUB_DEPT: string;
    UNIT: string;
    TO_DO_TOPIC: string;
    CIFNO: string;
    CUSTOMER_NAME: string;
    REF_NO: string;
    ACCOUNT_NO: string;
    EXPIRED_DATE: Date;
    CBAL: number;
    OTHER_INFO: string;
}
export class NotificationModel {
    yellow: number;
    red: number;
}