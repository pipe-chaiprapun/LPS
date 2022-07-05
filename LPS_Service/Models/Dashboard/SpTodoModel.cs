using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Dashboard
{
    public class SpTodoModel
    {
        public string DEPT { get; set; }
        public string SUB_DEPT { get; set; }
        public string UNIT { get; set; }
        public string TO_DO_TOPIC { get; set; }
        public int NO_CIF { get; set; }
        public decimal TOTAL_AMT { get; set; }
    }
}