using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class OdStatementModel
    {
        public decimal NUMBER { get; set; }
        public string MONTH { get; set; }
        public decimal CREDIT { get; set; }
        public decimal TURNOVER_CREDIT { get; set; }
        public decimal DEBIT { get; set; }
        public decimal TURNOVER_DEBIT { get; set; }
        public decimal HIGHEST_BAL { get; set; }
        public decimal LOWEST_BAL { get; set; }
        public decimal AVG_BAL { get; set; }
        public decimal ENDING_BAL { get; set; }
        public decimal SWING { get; set; }
        public decimal PER_OF_SWING { get; set; }
        public decimal MONTHLY_INTEREST { get; set; }
        public decimal RETURN_ITEM { get; set; }
        public decimal DEP_CHECK_AMT { get; set; }
        public string ACC_NAME { get; set; }
        public decimal NUMBER_OF_MONTH { get; set; }
        public decimal OD_RATE { get; set; }
        public decimal COST_CENTER { get; set; }
        public string COST_CENTER_NAME { get; set; }
        public string ZONE_NAME { get; set; }
        public string BRH_NAME { get; set; }
        public decimal ACC_NO { get; set; }
        public string AS_DATE { get; set; }
        public decimal OD_LIMIT { get; set; }
        public decimal AVG_CREDIT_TURNOVER { get; set; }
        public decimal PER_OF_OD_UTIL { get; set; }
        public decimal AVG_SWING { get; set; }
        public decimal AVG_PER_OF_SWING { get; set; }
        public decimal AVG_NUMBER_DEBIT { get; set; }
        public decimal AVG_NUMBER_CREDIT { get; set; }
        public decimal AVG_RETURN_CHECK_ITEM { get; set; }
        public decimal AVG_RETURN_CHECK_AMT { get; set; }
        public decimal AVG_RETURN_CHECK_AMT_ITEM { get; set; }
        public string CIF_NO { get; set; }
        public string ROLE_CODE { get; set; }
    }
}