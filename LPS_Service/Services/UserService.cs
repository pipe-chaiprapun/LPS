using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models.User;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;

namespace LPS_Service.Services
{
    public class UserService : IUserService
    {
        private LPSDBEntities _db = new LPSDBEntities();
        //public GetUsersModel GetUsers(UserFilterModel value)
        //{
        //    try
        //    {
        //        using (StreamReader r = new StreamReader(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Constants", "MockUser.json")))
        //        {
        //            string json = r.ReadToEnd();
        //            List<UserAccountModel> users = new List<UserAccountModel>();
        //            var format = "dd-MM-yyyy"; // your datetime format
        //            var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format, Culture = new CultureInfo("en-US") };

        //            if (string.IsNullOrEmpty(value.sortBy))
        //                users = JsonConvert.DeserializeObject<List<UserAccountModel>>(json, dateTimeConverter);
        //            else
        //            {
        //                users = value.ascending == true ? JsonConvert.DeserializeObject<List<UserAccountModel>>(json).
        //                    OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList() :
        //                    JsonConvert.DeserializeObject<List<UserAccountModel>>(json, dateTimeConverter).
        //                    OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
        //            }

        //            var filterUsers = new GetUsersModel
        //            {
        //                users = users.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
        //                totalItems = users.Count()
        //            };
        //            if (!string.IsNullOrEmpty(value.employeeId) || !string.IsNullOrEmpty(value.employeeName) ||
        //                !string.IsNullOrEmpty(value.unitId) || !string.IsNullOrEmpty(value.accountStatus) ||
        //                !string.IsNullOrEmpty(value.accountStatus))
        //            {
        //                var searchUsers = users;

        //                if (!string.IsNullOrEmpty(value.employeeId))
        //                    searchUsers = searchUsers.Where(c => c.employeeId.Contains(value.employeeId)).ToList();

        //                if (!string.IsNullOrEmpty(value.employeeName))
        //                    searchUsers = searchUsers.Where(c => c.employeeName.Contains(value.employeeName)).ToList();

        //                if (!string.IsNullOrEmpty(value.unitId))
        //                    searchUsers = searchUsers.Where(c => c.unitId.Equals(value.unitId)).ToList();

        //                if (!string.IsNullOrEmpty(value.accountStatus))
        //                {
        //                    if (!value.accountStatus.Equals("All"))
        //                        searchUsers = searchUsers.Where(c => c.accountStatus.Equals(value.accountStatus)).ToList();
        //                }

        //                filterUsers.users = searchUsers.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray();
        //                filterUsers.totalItems = searchUsers.Count();
        //            }
        //            return filterUsers;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw e.GetExceptionError();
        //    }
        //}
        //public UserAccountModel GetUserById(string id)
        //{
        //    try
        //    {
        //        using (StreamReader r = new StreamReader(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Constants", "MockUser.json")))
        //        {
        //            string json = r.ReadToEnd();

        //            List<UserAccountModel> users = new List<UserAccountModel>();
        //            var format = "dd-MM-yyyy"; // your datetime format
        //            var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format, Culture = new CultureInfo("en-US") };

        //            users = JsonConvert.DeserializeObject<List<UserAccountModel>>(json, dateTimeConverter);
        //            var user = users.FirstOrDefault(u => u.employeeId.Equals(id));

        //            if (user != null)
        //                return user;

        //            throw new Exception("Not found user!");
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw e.GetExceptionError();
        //    }
        //}

        public UserRoleModel[] GetRmRoles(string employee_id)
        {
            try
            {
                var roles = _db.Database.SqlQuery<UserRoleModel>("EXEC LPS_LST_USER_ROLE @EMPLOYEE_ID",
                    new SqlParameter[] {
                        new SqlParameter("@EMPLOYEE_ID", employee_id)
                    }).ToArray();
                return roles;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public RoleModel[] GetRmRoleFilter(int level, string parent)
        {
            try
            {
                if (level == 1)
                {
                    //var roles = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_LEVEL = @LEVEL",
                    //    new SqlParameter[]{
                    //new SqlParameter("@LEVEL", level)
                    //    }).ToList();
                    var roles = _db.Database.SqlQuery<RoleModel>(@"SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_LEVEL = 1
                                                                    UNION
                                                                    SELECT GROUP_CODE AS ROLE_CODE, GROUP_DESC AS ROLE_DESC, '' AS ROLE_PARENT, 1 AS ROLE_LEVEL FROM LPS_GROUP_ROLE").ToArray();

                    return roles;
                }
                else
                {
                    var roles = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                        new SqlParameter[]
                        {
                            new SqlParameter("@PARENT", parent),
                            new SqlParameter("@LEVEL", level),
                        }).ToArray();
                    return roles;
                }
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public RoleOrgModel[] GetRmRoleOrg(string role_code, string staff_no)
        {
            try
            {
                var org = _db.Database.SqlQuery<RoleOrgModel>("EXEC SP_LPS_LST_ORG @ROLE_CODE ,@STAFF_NO", new SqlParameter[]{
                    new SqlParameter("@ROLE_CODE", role_code),
                    new SqlParameter("@STAFF_NO", staff_no)
                }).ToArray();

                return org;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public List<EmpUnitModel> GetEmpUnit()
        {
            try
            {
                List<EmpUnitModel> Department = new List<EmpUnitModel>();

                #region Group role
                var groups = _db.Database.SqlQuery<RoleModel>("SELECT GROUP_CODE AS ROLE_CODE, GROUP_DESC AS ROLE_DESC FROM LPS_GROUP_ROLE").ToArray();
                foreach (var g in groups)
                {
                    //Department.Add(new EmpUnitModel { icon = "fa-users", unitId = g.ROLE_CODE, unitName = g.ROLE_DESC, child = new List<UnitChild>() });
                    List<UnitChild> GroupDepartment = new List<UnitChild>();
                    var groupDept = _db.
                        Database.
                        SqlQuery<RoleModel>(@"SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE 
                                            WHERE ROLE_LEVEL = 1 AND ROLE_CODE IN (SELECT ROLE_CODE FROM LPS_GROUP_MAP_ROLE WHERE GROUP_CODE = @GROUP_CODE)",
                                            new SqlParameter[] { new SqlParameter("@GROUP_CODE", g.ROLE_CODE) }).ToArray();

                    foreach (var d in groupDept)
                    {
                        List<UnitChild> SubDepartment = new List<UnitChild>();
                        var sub = _db.
                            Database.
                            SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                            new SqlParameter[]
                            {
                                new SqlParameter("@PARENT", d.ROLE_CODE),
                                new SqlParameter("@LEVEL", 2),
                            }).ToArray();

                        foreach (var s in sub)
                        {
                            List<UnitChild> UnitLeader = new List<UnitChild>();
                            var unitLeader = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                                new SqlParameter[]
                                {
                                new SqlParameter("@PARENT", s.ROLE_CODE),
                                new SqlParameter("@LEVEL", 3)
                                }).ToArray();
                            foreach (var u in unitLeader)
                            {
                                List<UnitChild> Unit = new List<UnitChild>();
                                var unit = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                                new SqlParameter[]
                                {
                                new SqlParameter("@PARENT", u.ROLE_CODE),
                                new SqlParameter("@LEVEL", 4)
                                }).ToArray();
                                foreach (var uu in unit)
                                {
                                    Unit.Add(new UnitChild { unitId = uu.ROLE_CODE, unitName = uu.ROLE_DESC });
                                }

                                UnitLeader.Add(new UnitChild { unitId = u.ROLE_CODE, unitName = u.ROLE_DESC, child = Unit });
                            }

                            SubDepartment.Add(new UnitChild { unitId = s.ROLE_CODE, unitName = s.ROLE_DESC, child = UnitLeader });
                        }

                        GroupDepartment.Add(new UnitChild { unitId = d.ROLE_CODE, unitName = d.ROLE_DESC, child = SubDepartment });
                    }

                    Department.Add(new EmpUnitModel { icon = "fa-users", unitId = g.ROLE_CODE, unitName = g.ROLE_DESC, child = GroupDepartment });
                }
                #endregion


                #region Normal role
                //var dept = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_LEVEL = 1").ToArray();
                var dept = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_LEVEL = 1 AND ROLE_CODE NOT IN(SELECT ROLE_CODE FROM LPS_GROUP_MAP_ROLE)").ToArray();

                foreach (var d in dept)
                {
                    List<UnitChild> SubDepartment = new List<UnitChild>();
                    var sub = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                        new SqlParameter[]
                        {
                            new SqlParameter("@PARENT", d.ROLE_CODE),
                            new SqlParameter("@LEVEL", 2),
                        }).ToArray();
                    foreach (var s in sub)
                    {
                        List<UnitChild> UnitLeader = new List<UnitChild>();
                        var unitLeader = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                            new SqlParameter[]
                            {
                                new SqlParameter("@PARENT", s.ROLE_CODE),
                                new SqlParameter("@LEVEL", 3)
                            }).ToArray();
                        foreach (var u in unitLeader)
                        {
                            List<UnitChild> Unit = new List<UnitChild>();
                            var unit = _db.Database.SqlQuery<RoleModel>("SELECT ROLE_CODE, ROLE_DESC, ROLE_PARENT, ROLE_LEVEL FROM LPS_ROLE WHERE ROLE_PARENT = @PARENT AND ROLE_LEVEL = @LEVEL",
                            new SqlParameter[]
                            {
                                new SqlParameter("@PARENT", u.ROLE_CODE),
                                new SqlParameter("@LEVEL", 4)
                            }).ToArray();
                            foreach (var uu in unit)
                            {
                                Unit.Add(new UnitChild { unitId = uu.ROLE_CODE, unitName = uu.ROLE_DESC });
                            }

                            UnitLeader.Add(new UnitChild { unitId = u.ROLE_CODE, unitName = u.ROLE_DESC, child = Unit });
                        }

                        SubDepartment.Add(new UnitChild { unitId = s.ROLE_CODE, unitName = s.ROLE_DESC, child = UnitLeader });
                    }

                    Department.Add(new EmpUnitModel { icon = d.ROLE_CODE == "S1000" ? "fa-user-secret" : "fa-user", unitId = d.ROLE_CODE, unitName = d.ROLE_DESC, child = SubDepartment });

                }
                #endregion

                return Department;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public GetRmModel GetRms(RmFilterModel value)
        {
            try
            {
                List<SpLstRmModel> rms = new List<SpLstRmModel>();

                rms = _db.Database.SqlQuery<SpLstRmModel>("EXEC SP_LPS_LST_RM @STAFF_NO, @STAFF_NAME, @DEPT, @SUB_DEPT, @UNIT, @FLAG_ROLE, @FLAG_STATUS", new SqlParameter[]{
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(value.staff_no) ? value.staff_no : "%"),
                    new SqlParameter("@STAFF_NAME", !string.IsNullOrEmpty(value.staff_name) ? value.staff_name : "%"),
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(value.department) ? value.department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(value.subDepartment) ? value.subDepartment : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(value.unit) ? value.unit : "%"),
                    new SqlParameter("@FLAG_ROLE", !string.IsNullOrEmpty(value.flag_role) ? value.flag_role : "A"),
                    new SqlParameter("@FLAG_STATUS", !string.IsNullOrEmpty(value.flag_status) ? value.flag_status : "%")
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    rms = value.ascending == true ? rms.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                  : rms.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                var filterRms = new GetRmModel
                {
                    rms = rms.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
                    totalItems = rms.Count()
                };

                return filterRms;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public int SetRmRole(string staff_no, string role_code, string create_by, string ip)
        {
            try
            {
                var res = _db.Database.ExecuteSqlCommand("EXEC SP_LPS_RM_MAP_ROLE @STAFF_NO, @ROLE_CODE, @MAP_TYPE, @CREATE_BY, @IP", new SqlParameter[] {
                    new SqlParameter("@STAFF_NO", staff_no),
                    new SqlParameter("@ROLE_CODE", role_code),
                    new SqlParameter("@MAP_TYPE", "S"),
                    new SqlParameter("@CREATE_BY", create_by),
                    new SqlParameter("@IP", ip)
                });
                return res;
            }
            //catch (SqlException e)
            //{
            //    var code = e.ErrorCode;
            //    if (code == -2146232060)
            //        throw new Exception("User already has this role!");

            //    throw e.GetExceptionError();
            //}
            catch (Exception e)
            {
                throw e;
                //var type = e.GetType();
                //throw e.GetExceptionError();
            }
        }
        public int DeleteRmRole(string staff_no, string role_code, string create_by, string ip)
        {
            try
            {
                var res = _db.Database.ExecuteSqlCommand("EXEC SP_LPS_RM_MAP_ROLE @STAFF_NO, @ROLE_CODE, @MAP_TYPE, @CREATE_BY, @IP", new SqlParameter[] {
                    new SqlParameter("@STAFF_NO", staff_no),
                    new SqlParameter("@ROLE_CODE", role_code),
                    new SqlParameter("@MAP_TYPE", "D"),
                    new SqlParameter("@CREATE_BY", create_by),
                    new SqlParameter("@IP", ip)
                });
                return res;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public int SetStatus(string staff_no, string flag, string update_by, string ip)
        {
            try
            {
                var res = _db.Database.ExecuteSqlCommand("EXEC SP_LPS_RM_SET_STATUS @STAFF_NO, @FLAG, @UPDATE_BY, @IP", new SqlParameter[] {
                    new SqlParameter("@STAFF_NO", staff_no),
                    new SqlParameter("@FLAG", flag),
                    new SqlParameter("@UPDATE_BY", update_by),
                    new SqlParameter("@IP", ip)
                });
                return res;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public string GetStatus(string staff_no)
        {
            try
            {
                var res = _db.Database.SqlQuery<string>("SELECT ACTIVE_FLAG FROM LPS_USER WHERE STAFF_NO = @STAFF_NO", new SqlParameter[] {
                    new SqlParameter("@STAFF_NO", staff_no)
                }).FirstOrDefault();
                return res;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
    }
}