using LPS_Service.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Customer
{
    public class CustomerInfoModel
    {
        public SpCustomerModel customerInfo { get; set; }
        public CustomerGroup[] customerGroup { get; set; }
        public SpCustomerRating[] creditRating { get; set; }
        public CustomerContact[] contactInfo { get; set; }
        public CustomerWatchListModel[] watchlist { get; set; }
    }
    public class CustomerGroup
    {
        public string groupNo { get; set; }
        public string groupName { get; set; }
        public SpCustomerGroupModel[] data { get; set; }
    }
    public class CustomerContact
    {
        public string CONTACT_NAME { get; set; }
        public string CONTACT_TEL { get; set; }
    }
}
