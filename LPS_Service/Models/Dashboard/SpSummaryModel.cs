using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Dashboard
{
    public class SpSummaryModel
    {
        public string DEPT { get; set; }
        public string SUB_DEPT { get; set; }
        public string UNIT { get; set; }
        public string ALL_PRODUCT_ALCO { get; set; }
        public decimal INIT_TOTAL_LIMIT { get; set; }
        public decimal INIT_TOTAL_CBAL { get; set; }
        public string INIT_ASDATE { get; set; }
        public decimal TOTAL_TARGET { get; set; }
        public decimal CURRENT_TOTAL_LIMIT { get; set; }
        public decimal CURRENT_TOTAL_CBAL { get; set; }
        public string CURRENT_ASDATE { get; set; }
        public decimal DIFF_TARGET { get; set; }
        public decimal DIFF_INIT_LIMIT { get; set; }
        public decimal DIFF_INIT_CBAL { get; set; }
        public string VARIANCE_DATE { get; set; }
        public decimal AVG_OUTSTANDING { get; set; }
    }   
}