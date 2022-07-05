using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Account
{
    public class CollateralFilterModel
    {
        public string cif { get; set; }
        public string account_no { get; set; }
        public string sortBy { get; set; }
        public bool ascending { get; set; }
    }
    public class GetCollateralModel
    {
        public string ACCTNO { get; set; }
        public string CIFNO { get; set; }
        public string CCDCID { get; set; }
        public string CCDNAM { get; set; }
        public string CCDDSC { get; set; }
        public string COLLATERAL_CAT { get; set; }
        public decimal CCDCMV { get; set; }
        public string VALUATION_DATE { get; set; }
        public string NEXT_VALUATION_DATE { get; set; }
        public string DETAIL_FLAG { get; set; }
        public CollateralDetailModel[] COLLATERAL_DETAILS { get; set; }
    }
    public class CollateralModel
    {
        public string ACCTNO { get; set; }
        public string CIFNO { get; set; }
        public string CCDCID { get; set; }
        public string CCDNAM { get; set; }
        public string CCDDSC { get; set; }
        public string COLLATERAL_CAT { get; set; }
        public decimal CCDCMV { get; set; }
        public string DETAIL_FLAG { get; set; }
    }

    public class CollateralDetailModel
    {
        public string CCDCID { get; set; }
        public int SEQ { get; set; }
        public string PARAM_NAME { get; set; }
        public string PARAM_VALUE { get; set; }
        public string DISPLAY_NAME { get; set; }
        public string NUMBER_FORMAT_FLAG { get; set; }
    }
}