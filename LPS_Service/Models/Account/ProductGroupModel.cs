using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class ProductGroupModel
    {
        public string[] loanProducts { get; set; }
        public string[] depositProducts { get; set; }
        public string[] loanLimitProducts { get; set; }
    }

}