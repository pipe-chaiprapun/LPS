export class RmModel {
    public STAFF_NO: string;
    public STAFF_NAME: string;
    public ROLE_CODE: string;
    public ROLE_DESC: string;
    public DEPT: string;
    public SUB_DEPT: string;
    public UNIT_HEAD: string;
    public UNIT: string;
    public ACTIVE_FLAG: string;
}

export class RmFilterModel {
    public startPage: number;
    public limitPage: number;
    public sortBy: string;
    public ascending: boolean;
    public staff_no: string;
    public staff_name: string;
    public department: string;
    public subDepartment: string;
    public unit: string;
    public flag_role: string;
    public flag_status: string;
}

export class GetRmModel {
    rms: RmModel[];
    totalItems: number;
}