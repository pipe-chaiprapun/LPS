using LPS_Service.Interfaces;
using LPS_Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.DirectoryServices;
using System.Web.Configuration;
using LPS_Service.Entity;
using System.Runtime.InteropServices;
using LPS_Service.Models.User;
using System.Data.SqlClient;

namespace LPS_Service.Services
{
    public class AuthenService : IAuthenService
    {
        private DirectoryEntry _adEntry;
        private DirectorySearcher _adSearcher;
        private LPSDBEntities _db = new LPSDBEntities();
        private IUserService _user;
        private ILogService _log;
        private static string _adHost = WebConfigurationManager.AppSettings["ADHost"].ToString();
        private readonly string _url = $"LDAP://{_adHost}/dc=lhb,dc=net";

        public UserModel VerifyUsernamePassword(LoginModel value, string ip, bool adLogin, bool production)
        {
            try
            {
                _user = new UserService();
                _log = new LogService();

                if (adLogin)
                {

                    if (production)
                    {
                        _adEntry = new DirectoryEntry(_url, value.username, value.password, AuthenticationTypes.Secure);
                        _adSearcher = new DirectorySearcher(_adEntry);
                        _adSearcher.Filter = $"cn={value.username}";
                        var res = _adSearcher.FindOne();
                        if (res != null)
                        {
                            return new UserModel
                            {
                                username = value.username,
                                name = res.Properties["description"][0].ToString(),
                                roles = _user.GetRmRoles(value.username),
                                role = RoleAccount.User,
                                status = _user.GetStatus(value.username)
                            };
                        }
                        return null;
                    }
                    else
                    {
                        _adEntry = new DirectoryEntry(_url);
                        _adSearcher = new DirectorySearcher(_adEntry);

                        _adSearcher.Filter = $"cn={value.username}";
                        var foundUsername = _adSearcher.FindAll();

                        if (foundUsername.Count == 0)
                            return null;

                        return new UserModel
                        {
                            username = value.username,
                            name = foundUsername[0].Properties["description"][0].ToString(),
                            roles = _user.GetRmRoles(value.username),
                            role = RoleAccount.User,
                            status = _user.GetStatus(value.username)
                        };
                    }
                }
                else
                {
                    var res = _db.Database.SqlQuery<LPS_USER>("SELECT * FROM LPS_USER WHERE STAFF_NO = @STAFF_NO", new SqlParameter[] {
                        new SqlParameter("@STAFF_NO", value.username)
                    }).FirstOrDefault();
                    
                    if(res != null)
                    {
                        var user = new UserModel
                        {
                            username = value.username,
                            name = res.STAFF_NAME,
                            roles = _user.GetRmRoles(value.username),
                            role = RoleAccount.User,
                            status = _user.GetStatus(value.username)
                        };
                        return user;
                    }
                    return null;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                if (adLogin)
                {
                    _adEntry.Dispose();
                    _adSearcher.Dispose();
                }
            }
        }

        public MasterDataModel[] GetMasterData()
        {
            try
            {
                var data = _db.Database.SqlQuery<MasterDataModel>("SELECT PARAM_TYPE, PARAM_VALUE FROM LPS_PARAMETER").ToArray();
                return data;
            }
            catch(Exception e)
            {
                throw e;
            }
        } 
    }
}