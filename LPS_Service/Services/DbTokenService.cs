using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.DirectoryServices;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace LPS_Service.Services
{
    public class DbTokenService : ITokenService
    {
        LPSDBEntities _db = new LPSDBEntities();
        UserService _user = new UserService();
        private static int _tokenExp = int.Parse(WebConfigurationManager.AppSettings["TokenExp"]);

        public string GenerateAccessToken(string username, string ip)
        {
            try
            {
                var currentToken = _db.LPS_TOKEN.SingleOrDefault(t => t.EMPLOYEE_ID.Equals(username));
                var newToken = new LPS_TOKEN
                {
                    EMPLOYEE_ID = username,
                    TOKEN = Guid.NewGuid().ToString(),
                    EXPIRE = DateTime.Now.AddMinutes(_tokenExp),
                    IP = ip
                };

                if (currentToken == null)
                {
                    _db.LPS_TOKEN.Add(newToken);
                    _db.SaveChanges();
                    return newToken.TOKEN;
                }

                _db.LPS_TOKEN.Attach(currentToken);
                currentToken.TOKEN = newToken.TOKEN;
                currentToken.EXPIRE = DateTime.Now.AddMinutes(_tokenExp);
                currentToken.IP = ip;
                _db.Entry(currentToken).State = EntityState.Modified;
                _db.SaveChanges();
                return newToken.TOKEN;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public string GenerateAccessToken_SP(string username, string ip)
        {
            var token = Guid.NewGuid().ToString();
            var count = token.Length;
            var resUpdate = new SqlParameter("@P_RESULT", SqlDbType.Bit) { Direction = ParameterDirection.Output };
            var resMessage = new SqlParameter("@P_MESSAGE", SqlDbType.NVarChar) { Size = 500, Direction = ParameterDirection.Output };
            try
            {
                var res = _db.Database.ExecuteSqlCommand(@"EXEC @RETURN_VALUE = SP_LPS_GEN_TOKEN @EMPLOYEE_ID, @TOKEN, @EXTEND, @IP, @P_RESULT OUTPUT, @P_MESSAGE OUTPUT",
                new SqlParameter[]
                {
                    new SqlParameter("@EMPLOYEE_ID", username),
                    new SqlParameter("@TOKEN", token),
                    new SqlParameter("@EXTEND", _tokenExp),
                    new SqlParameter("@IP", ip),
                    resUpdate,
                    resMessage
                });
                var resCode = (bool)resUpdate.Value;
                if (resCode)
                    return token;
                else
                    throw new Exception(resMessage.Value.ToString());
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public UserModel VerifyAccessToken(string token)
        {
            try
            {
                var currentToken = _db.LPS_TOKEN.SingleOrDefault(t => t.TOKEN.Equals(token));

                if (currentToken == null)
                    return null;

                if (currentToken.EXPIRE < DateTime.Now)
                    return null;

                _db.LPS_TOKEN.Attach(currentToken);
                currentToken.EXPIRE = DateTime.Now.AddMinutes(_tokenExp);
                _db.Entry(currentToken).State = EntityState.Modified;
                _db.SaveChanges();

                return new UserModel
                {
                    username = currentToken.EMPLOYEE_ID,
                    role = RoleAccount.User,
                };

            }
            catch
            {
                return null;
            }
        }
        public void SetTokenExpiration(string staff_no, int expire)
        {
            try
            {
                var currentToken = _db.LPS_TOKEN.SingleOrDefault(t => t.EMPLOYEE_ID.Equals(staff_no));

                if (currentToken != null)
                {
                    _db.LPS_TOKEN.Attach(currentToken);
                    currentToken.EXPIRE = expire == 0 ? DateTime.Now : DateTime.Now.AddMinutes(_tokenExp);
                    _db.Entry(currentToken).State = EntityState.Modified;
                    _db.SaveChangesAsync();
                }
            }
            catch
            {
                return;
            }
        }
    }
}