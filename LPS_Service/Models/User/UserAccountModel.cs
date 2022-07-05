using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class UserAccountModel
    {
        public string employeeId { get; set; }
        public string employeeName { get; set; }
        public string unitId { get; set; }
        public string unitName { get; set; }
        public string positionId { get; set; }
        public string positionName { get; set; }
        public SystemRole[] systemRole { get; set; }
        public string accountStatus { get; set; }
        public DateTime requestDate { get; set; }
        public string requestedEmpId { get; set; }
        public string requestedEmpName { get; set; }
        public DateTime approvalDate { get; set; }
        public string approvedEmpId { get; set; }
        public string approvalStatus { get; set; }
    }
    public class SystemRole {
        public string roleId { get; set; }
        public string roleName { get; set; }
    }
    public class UserFilterModel
    {
        [Required]
        public int startPage { get; set; }
        [Required]
        public int limitPage { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
        public string employeeId { get; set; }
        public string employeeName { get; set; }
        public string unitId { get; set; }
        public string roleId { get; set; }
        public string accountStatus { get; set; }
    }
    public class GetUsersModel
    {
        public UserAccountModel[] users { get; set; }
        public int totalItems { get; set; }
    }
}