using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class LoanAccountFilterModel
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
    public class GetLoanAccountModel
    {
        public SpLoanAccountModel[] accounts { get; set; }
        public int totalItems { get; set; }
    }
}