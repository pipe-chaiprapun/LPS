using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.Report
{
    public class ReportModel
    {
        [JsonProperty("id")]
        public string REPORT_ID { get; set; }
        [JsonProperty("desc")]
        public string REPORT_DESC { get; set; }
        [JsonProperty("active")]
        public bool ACTIVE { get; set; }
    }
}