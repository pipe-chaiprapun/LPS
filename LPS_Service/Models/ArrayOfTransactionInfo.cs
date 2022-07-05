using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models
{

    public partial class ArrayOfTransactionInfo
    {
        public ArrayOfTransactionInfoTransactionInfo[] TransactionInfo
        {
            get;set;
        }
    }

    public partial class ArrayOfTransactionInfoTransactionInfo
    {
        
        /// <remarks/>
        public string AmcCode
        {
            get;set;
        }

        /// <remarks/>
        public string FundType
        {
            get; set;
        }

        /// <remarks/>
        public string FundCode
        {
            get; set;
        }

        /// <remarks/>
        public string HolderId
        {
            get; set;
        }

        /// <remarks/>
        public string Name
        {
            get; set;
        }

        /// <remarks/>
        public string TranDate
        {
            get; set;
        }

        /// <remarks/>
        public string TranTypeCode
        {
            get; set;
        }

        /// <remarks/>
        public string AmountUnit
        {
            get; set;
        }

        /// <remarks/>
        public string AmountBaht
        {
            get; set;
        }

        /// <remarks/>
        public string NAVPrice
        {
            get; set;
        }

        /// <remarks/>
        public string Url
        {
            get; set;
        }

        /// <remarks/>
        public string Status
        {
            get; set;
        }

        /// <remarks/>
        public string Source
        {
            get; set;
        }

        /// <remarks/>
        public string IPFGAccount
        {
            get; set;
        }

        /// <remarks/>
        public string BranchAccount
        {
            get; set;
        }

        /// <remarks/>
        public string CardID
        {
            get; set;
        }

        /// <remarks/>
        public string OfficerID
        {
            get; set;
        }

        /// <remarks/>
        public string SPRRate
        {
            get; set;
        }

        public string Count
        {
            get; set;
        }

        public string SPRRateAmount
        {
            get; set;
        }
        public string SPRRateGL
        {
            get; set;
        }
        public string SPRRateGLAmount
        {
            get; set;
        }
        public string FEELHFG
        {
            get; set;
        }
        public string EM_CODE
        {
            get; set;
        }
        public string CC_CODE
        {
            get; set;
        }
        public string GROUP
        {
            get; set;
        }
        public string SECTER
        {
            get; set;
        }
        public string DEPARTMENT
        {
            get; set;
        }
        public string UNIT
        {
            get; set;
        }
        public string DIVISION
        {
            get; set;
        }
        public string SECTION
        {
            get; set;
        }
        public string OP_TNAME
        {
            get; set;
        }

    }
}