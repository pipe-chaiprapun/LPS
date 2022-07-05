using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class SpLoanAccountModel
    {
        public string ACCTNO { get; set; }
        public string ACTYPE { get; set; }
        public string PRODUCT_CODE { get; set; }
        public string PRODUCT_GROUP { get; set; }
        public string LIMIT_NO { get; set; }
        public decimal OUTSTANDING { get; set; }
        public decimal INT_RATE { get; set; }
        public string ISSUE_DATE { get; set; }
        public string MATURITY_DATE { get; set; }
        public string AGING { get; set; }
        public decimal LATE_CHARGE { get; set; }
        public decimal MISC_CHARGE { get; set; }
        public string TDR_FLAG { get; set; }
        public decimal? PROVISION_TFRS9 { get; set; }
        public string PROVISION_DATE { get; set; }
    }
}