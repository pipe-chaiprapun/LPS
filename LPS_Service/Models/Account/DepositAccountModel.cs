using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class DepositAccountFilterModel
    {
        [Required]
        public int startPage { get; set; }
        [Required]
        public int limitPage { get; set; }
        [Required]
        public string cif { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
        public string productGroup { get; set; }
    }
    public class GetDepositAccountModel
    {
        public SpDepositAccountModel[] accounts { get; set; }
        public int totalItems { get; set; }
    }
}