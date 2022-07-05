using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class SpDepositAccountModel
    {
        public string ACCTNO { get; set; }
        public string ACTYPE { get; set; }
        public string PRODUCT_CODE { get; set; }
        public string PRODUCT_GROUP { get; set; }
        public decimal BALANCE { get; set; }
        public decimal INT_RATE { get; set; }
        public string ISSUE_DATE { get; set; }
        public string MATURITY_DATE { get; set; }
    }
}