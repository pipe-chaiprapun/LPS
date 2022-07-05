using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class SpLoanLimitModel
    {
        public string LIMIT_NO { get; set; }
        public string ALL_PRODUCT_ALCO { get; set; }
        public decimal TOTAL_LIMIT { get; set; }
    }

    public class LoanLimitFilterModel
    {
        [Required]
        public int startPage { get; set; }
        [Required]
        public int limitPage { get; set; }
        [Required]
        public string cif { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
        public string productAlco { get; set; }
    }
    public class GetLoanLimitModel
    {
        public SpLoanLimitModel[] loans { get; set; }
        public int totalItems { get; set; }
    }

    public class GetLoanlimitDetailModel
    {
        public string AFOFFR { get; set; }
        public string AFAPNO { get; set; }
        public string AFFCDE { get; set; }
        public string AFSEQ { get; set; }
        public string AFLEVL { get; set; }
        public string AFLTYP { get; set; }
        public string AFCPNO { get; set; }
        public string AFCUR { get; set; }
        public decimal? AFFAMT { get; set; }
        public GetLoanlimitDetailModel child { get; set; }
    }
    public class GetLoanlimitDetailModel2
    {
        public string AFOFFR { get; set; }
        public string AFAPNO { get; set; }
        public string AFFCDE { get; set; }
        public string AFSEQ { get; set; }
        public string AFLEVL { get; set; }
        public string AFLTYP { get; set; }
        public string AFCPNO { get; set; }
        public string AFCUR { get; set; }
        public decimal? AFFAMT { get; set; }
        public List<GetLoanlimitDetailModel2> children { get; set; }
    }
    public class SpLoanLimitDetailModel
    {
        public string AFOFFR { get; set; }
        public string AFAPNO { get; set; }
        public string AFFCDE { get; set; }
        public string AFSEQ { get; set; }
        public string AFLEVL { get; set; }
        public string AFLTYP { get; set; }
        public string AFCPNO { get; set; }
        public string AFCUR { get; set; }
        public decimal? AFFAMT { get; set; }
        public string AFAPNO_L1 { get; set; }
        public string AFFCDE_L1 { get; set; }
        public string AFSEQ_L1 { get; set; }
        public string AFLEVL_L1 { get; set; }
        public string AFLTYP_L1 { get; set; }
        public string AFCPNO_L1 { get; set; }
        public string AFCUR_L1 { get; set; }
        public decimal? AFFAMT_L1 { get; set; }
        public string AFAPNO_L2 { get; set; }
        public string AFFCDE_L2 { get; set; }
        public string AFSEQ_L2 { get; set; }
        public string AFLEVL_L2 { get; set; }
        public string AFLTYP_L2 { get; set; }
        public string AFCPNO_L2 { get; set; }
        public string AFCUR_L2 { get; set; }
        public decimal? AFFAMT_L2 { get; set; }
    }
}