using LPS_Service.Models.User;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models
{
    public class UserModel
    {
        public string username { get; set; }
        [JsonIgnore]
        public string password { get; set; }
        public string name { get; set; }
        public UserRoleModel[] roles { get; set; }
        //public string position { get; set; }
        //public string department { get; set; }
        //public string subDepartment { get; set; }
        //public string unit { get; set; }
        public RoleAccount role { get; set; }
        public string status { get; set; }
    }
    //public class CurrentSession
    //{
    //    public string username { get; set; }
    //    [JsonIgnore]
    //    public string password { get; set; }
    //    public string name { get; set; }
    //    public UserRoleModel role { get; set; }
    //}
    public enum RoleAccount : short
    {
        UnknowUser = 0,
        Root = 1,
        Admin = 2,
        User = 3
    }
}