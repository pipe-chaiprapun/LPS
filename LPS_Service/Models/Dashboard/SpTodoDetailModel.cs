using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Dashboard
{
    public class SpTodoDetailModel
    {
        public string DEPT { get; set; }
        public string SUB_DEPT { get; set; }
        public string UNIT { get; set; }
        public string TO_DO_TOPIC { get; set; }
        public string CIFNO { get; set; }
        public string CUSTOMER_NAME { get; set; }
        public string REF_NO { get; set; }
        public string ACCOUNT_NO { get; set; }
        public string EXPIRED_DATE { get; set; }
        public decimal CBAL { get; set; }
        public string OTHER_INFO { get; set; }
    }
}