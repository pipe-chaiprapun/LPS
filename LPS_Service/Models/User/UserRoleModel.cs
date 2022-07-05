using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class UserRoleModel
    {
        public string STAFF_NO { get; set; }
        public string ROLE_CODE { get; set; }
        public string ROLE_DESC { get; set; }
        public string AO_KEY { get; set; }
        public int? ROLE_LEVEL { get; set; }
    }
}