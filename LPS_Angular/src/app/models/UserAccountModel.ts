export class UserAccountModel {
    employeeId: string;
    employeeName: string;
    unitId: string;
    unitName: string;
    positionId: string;
    positionName: string;
    systemRole: SystemRole[];
    accountStatus: string;
    requestDate: string;
    requestedEmpId: string;
    requestedEmpName: string;
    approvalDate: string;
    approvedEmpId: string;
    approvalStatus: string;
}

export class SystemRole {
    roleId: string;
    roleName: string;
}

export class UserFilterModel {
    startPage: number;
    sortBy: string;
    ascending: boolean;
    employeeId: string;
    employeeName: string;
    unitId: string;
    roleId: string;
    accountStatus: string;
}

export class GetUsersModel {
    users: UserAccountModel[];
    totalItems: number;
}

