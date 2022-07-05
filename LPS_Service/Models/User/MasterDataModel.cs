using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class MasterDataModel
    {
        [JsonProperty("key")]
        public string PARAM_TYPE { get; set; }
        [JsonProperty("value")]
        public string PARAM_VALUE { get; set; }
    }
}