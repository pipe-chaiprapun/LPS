using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class SpCustomerRating
    {
        public string CIF_KEY { get; set; }
        public string RATING_TYPE { get; set; }
        public string RATING_COMPANY { get; set; }
        public string RATING { get; set; }
        public string RATING_DATE { get; set; }
    }
}