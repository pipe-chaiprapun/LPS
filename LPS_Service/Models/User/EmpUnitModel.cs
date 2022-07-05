using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LPS_Service.Models.User
{
    public class EmpUnitModel
    {
        public string unitId { get; set; }
        public string unitName { get; set; }
        public string icon { get; set; }
        public List<UnitChild> child { get; set; }
    }

    public class UnitChild
    {
        public string unitId { get; set; }
        public string unitName { get; set; }
        public List<UnitChild> child { get; set; }
    }

    //public class UnitChild1
    //{
    //    public string unitId { get; set; }
    //    public string unitName { get; set; }
    //    public UnitChild2[] child { get; set; }
    //}

    //public class UnitChild2
    //{
    //    public string unitId { get; set; }
    //    public string unitName { get; set; }
    //}
}