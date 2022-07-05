using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class ChargeModel
    {
        public double LateCharge { get; set; }
        public decimal MiscCharge { get; set; }
        public decimal Provision { get; set; }
    }
}