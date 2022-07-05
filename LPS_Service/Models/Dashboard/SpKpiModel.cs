using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Dashboard
{
    public class SpKpiModel
    {
        public string TOPIC { get; set; }
        public decimal LOAN_TARGET { get; set; }
        public decimal YTD { get; set; }
        public decimal DIFF { get; set; }
        public decimal ACTUAL { get; set; }
        public string ASDATE { get; set; }
    }
}