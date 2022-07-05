using LPS_Service.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface IUserService
    {
        //GetUsersModel GetUsers(UserFilterModel value);
        List<EmpUnitModel> GetEmpUnit();
        //UserAccountModel GetUserById(string id);
        UserRoleModel[] GetRmRoles(string employee_id);
        RoleOrgModel[] GetRmRoleOrg(string role_code, string staff_no);
        //UserSysRoleModel[] GetUserSysRoles(string employee_id);
        RoleModel[] GetRmRoleFilter(int level, string parent);
        GetRmModel GetRms(RmFilterModel value);
        int SetRmRole(string staff_no, string role_code, string create_by, string ip);
        int DeleteRmRole(string staff_no, string role_code, string create_by, string ip);
        int SetStatus(string staff_no, string flag, string update_by, string ip);
        string GetStatus(string staff_no);
    }
}
