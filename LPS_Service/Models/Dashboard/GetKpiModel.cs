using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Dashboard
{
    public class GetKpiModel
    {
        public DateTime date { get; set; }
        public SpKpiModel[] kpi { get; set; }
    }
}