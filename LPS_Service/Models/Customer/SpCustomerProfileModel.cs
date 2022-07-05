using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class SpCustomerProfileModel
    {
        public string Product_Type { get; set; }
        public string CIFNO { get; set; }
        public string Product { get; set; }
        public decimal Total_CBAL { get; set; }
        public decimal AVG_CBAL { get; set; }
        public decimal CR_LIMIT { get; set; }
        public Int64 Seq { get; set; }
    }
}