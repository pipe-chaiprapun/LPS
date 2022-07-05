export class UserRoleModel {
    STAFF_NO: string;
    ROLE_CODE: string;
    ROLE_DESC: string;
    AO_KEY: string;
    ROLE_LEVEL: number;
}

export class RoleOrgModel {
    ROLE_CODE: string;
    ROLE_DESC: string;
    ROLE_PARENT: string;
    ROLE_LEVEL: number;
    ROLE_PARENT_DESC: string;
}

export class GetRoleOrgModel {
    department: RoleOrgModel[];
    subDepartment: RoleOrgModel[];
    unit: RoleOrgModel[];
    unitLeader: RoleOrgModel[];
}

export enum RoleType {
    Security = 0,
    Rm = 1
}
