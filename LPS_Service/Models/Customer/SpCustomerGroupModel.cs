using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class SpCustomerGroupModel
    {
        public string CUSTOMER_GROUP_NO { get; set; }
        public string CUSTOMER_GROUP_NAME { get; set; }
        public string CIF_KEY { get; set; }
        public string CUSTOMER_NAME { get; set; }
        public string CUSTOMER_GROUP_RELATION { get; set; }
    }

    public class SpCustomerGroupsModel
    {
        public string CUSTOMER_GROUP_NO { get; set; }
        public int SEQ { get; set; }
        public string CUSTOMER_GROUP_NAME { get; set; }
    }
}