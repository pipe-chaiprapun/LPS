using LPS_Service.Models;
using LPS_Service.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace LPS_Service.Services
{
    public class UserLogin : GenericPrincipal
    {
        public UserModel User { get; set; }
        public UserLogin(IIdentity identity, RoleAccount roles) : base(identity, new string[] { roles.ToString() })
        {
        }
    }
}