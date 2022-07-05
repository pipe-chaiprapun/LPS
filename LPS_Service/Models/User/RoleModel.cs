using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class RoleModel
    {
        public string ROLE_CODE { get; set; }
        public string ROLE_DESC { get; set; }
        public string ROLE_PARENT { get; set; }
        public int ROLE_LEVEL { get; set; }
    }
}