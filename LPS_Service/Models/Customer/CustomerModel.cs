using LPS_Service.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class CustomerFilterModel
    {
        [Required]
        public int startPage { get; set; }
        [Required]
        public int limitPage { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
        public string cif { get; set; }
        public string name { get; set; }
        public string department { get; set; }
        public string subDepartment { get; set; }
        public string unit { get; set; }
        public string staff_no { get; set; }
        public string group_no { get; set; }
    }
    public class GetCustomersModel
    {
        //public CustomerModel[] customers { get; set; }
        public SpCustomerModel[] customers { get; set; }
        public int totalItems { get; set; }
    }
    public class CustomerGroupFilterModel
    {
        public string department { get; set; }
        public string subDepartment { get; set; }
        public string unit { get; set; }
        public string staffNo { get; set; }
    }
}