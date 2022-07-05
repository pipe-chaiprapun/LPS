using LPS_Service.Entity;
using LPS_Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Services
{
    public class LogService : ILogService
    {
        private LPSDBEntities _db = new LPSDBEntities();

        public void logSignin(LPS_LOG_SIGNIN log)
        {
            _db.LPS_LOG_SIGNIN.Add(log);
            _db.SaveChangesAsync();
        }
        public void logSetRole(string staff_no, string role_code, string staff_assign)
        {

        }
    }
}