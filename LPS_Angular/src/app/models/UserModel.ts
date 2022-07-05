import { UserRoleModel } from './User/UserRoleModel';

export class UserModel {
    username: string;
    name: string;
    roles: UserRoleModel[];
    role: number;
}
