using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class SpLstRmModel
    {
        public string STAFF_NO { get; set; }
        public string STAFF_NAME { get; set; }
        public string ROLE_CODE { get; set; }
        public string ROLE_DESC { get; set; }
        public string DEPT { get; set; }
        public string SUB_DEPT { get; set; }
        public string UNIT_HEAD { get; set; }
        public string UNIT { get; set; }
        public string ACTIVE_FLAG { get; set; }
    }
    public class RmFilterModel
    {
        [Required]
        public int startPage { get; set; }
        [Required]
        public int limitPage { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
        public string staff_no { get; set; }
        public string staff_name { get; set; }
        public string department { get; set; }
        public string subDepartment { get; set; }
        public string unit { get; set; }
        public string flag_role { get; set; }
        public string flag_status { get; set; }
    }
    public class GetRmModel
    {
        public SpLstRmModel[] rms { get; set; }
        public int totalItems { get; set; }
    }
}