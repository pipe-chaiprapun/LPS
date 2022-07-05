using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class SpCustomerModel
    {
        public string DEPT { get; set; }
        public string SUB_DEPT { get; set; }
        public string UNIT { get; set; }
        public string STAFF_NO { get; set; }  // take
        public int CIF_KEY { get; set; } // take
        public string CUSTOMER_NAME { get; set; } // take
        public decimal CREDIT_LIMIT { get; set; } // take
        public decimal OUTSTANDING_CASH { get; set; } // take
        public decimal OUTSTANDING_NON_CASH { get; set; } // take
        public decimal YIELD { get; set; } // take
        public string STAFF_NAME { get; set; } // takee
        public string REGISTER_DATE { get; set; }
        public string CUSTOMER_ADDRESS { get; set; }
        public string TELEPHONE { get; set; }
        public string FAX { get; set; }
        public int? NO_OF_STAFF { get; set; }
        public decimal? NET_PROFIT { get; set; }
        public decimal? NET_ASSET { get; set; }
        public string BUSINESS_SIZE { get; set; }
        public string CLASSIFICATION { get; set; }
        public string WATCHLIST_FLAG { get; set; }
        public string RESCHEDULE_FLAG { get; set; }
        public string TDR_FLAG { get; set; }
        public decimal? TOTAL_PROVISION { get; set; }
        public string PARAM_VALUE { get; set; }
        public string REGISTRATION_NO { get; set; }
        public string DR_FLAG { get; set; }
        public string NDR_FLAG { get; set; }
    }
}