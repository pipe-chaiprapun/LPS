using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models
{
    public class JwtPayloadModel
    {
        public string username { get; set; }
        public DateTime exp { get; set; }
    }
}