import { UserModel } from '../UserModel';
import { UserRoleModel } from './UserRoleModel';

export class CurrentSessionModel {
    user: UserModel;
    currentRole: UserRoleModel;
    accessToken: string;
}